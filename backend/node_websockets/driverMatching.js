const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

mongoose.connect('mongodb+srv://manavmaj2001:pEUHcpVLkrUys5VP@ugocluser.qv3ihnu.mongodb.net/UgoCluser?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  await Ride.deleteMany({});
  await ActiveDriver.deleteMany({});
  await Rider.deleteMany({});
  console.log('Database cleared');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const rideSchema = new mongoose.Schema({
  riderId: String,
  driverId: String,
  status: String,
});

const Ride = mongoose.model('Ride', rideSchema);

const activeDriverSchema = new mongoose.Schema({
  driverId: String,
  available: Boolean,
});

const riderSchema = new mongoose.Schema({
  riderId: String,
});

const ActiveDriver = mongoose.model('ActiveDriver', activeDriverSchema);
const Rider = mongoose.model('Rider', riderSchema);

app.use(express.static('public'));

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'mysecretkey', (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

// A mapping of driver user IDs to socket IDs
const userSocketIds = {};

io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  try {
    const decoded = await verifyToken(token);
    socket.user = { userId: decoded.user_id, name: decoded.name };
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('register', async (data) => {
    console.log(`Register event received from ${socket.user.name} (${socket.user.userId}):`, data);
    try {
      if (data.type === 'driver') {
        await ActiveDriver.create({ driverId: socket.user.userId, available: false });
        userSocketIds[socket.user.userId] = socket.id;
      } else if (data.type === 'rider') {
        await Rider.create({ riderId: socket.user.userId });
        userSocketIds[socket.user.userId] = socket.id;
      }
      const drivers = await ActiveDriver.find();
      const riders = await Rider.find();
      io.emit('update', { drivers, riders });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });

  socket.on('setAvailability', async (data) => {
    try {
      if (data && data.available !== undefined) {
        await ActiveDriver.findOneAndUpdate({ driverId: socket.user.userId }, { available: data.available });
        const drivers = await ActiveDriver.find();
        io.emit('update', { drivers });
        console.log(`Driver ${socket.user.name} (${socket.user.userId}) availability changed to ${data.available}`);
      } else {
        console.error('Invalid setAvailability data:', data);
      }
    } catch (error) {
      console.error('Error setting driver availability:', error);
    }
  });

  socket.on('requestRide', async (data) => {
    try {
      const ride = await Ride.create({
        riderId: data.userId,
        status: 'pending',
      });
      console.log(`Ride request received from rider ${data.userId} (${socket.user.name})`);
      const driver = await findNextAvailableDriver();
      if (driver) {
        const driverSocketId = userSocketIds[driver.driverId];
        if (driverSocketId) {
          io.to(driverSocketId).emit('rideRequested', { 
            rideId: ride._id, 
            riderId: data.userId, 
            riderName: socket.user.name 
          });
          console.log("Ride request emitted to driver", driver.driverId);
        } else {
          console.log("Driver not connected", driver.driverId);
        }
      } else {
        // No available driver found, emit 'rideDeclined' to the rider
        const riderSocketId = userSocketIds[data.userId];
        if (riderSocketId) {
          io.to(riderSocketId).emit('rideDeclined');
          console.log("Ride declined emitted to rider", data.userId);
        } else {
          console.log("Rider not connected", data.userId);
        }
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  });

  socket.on('rideResponse', async (data) => {
    try {
      const ride = await Ride.findById(data.rideId);
      if (data.accepted) {
        ride.driverId = socket.user.userId;
        ride.status = 'accepted';
        await ride.save();
        io.to(ride.riderId).emit('rideAccepted', { driverId: socket.user.userId });
      } else {
        // Set the current driver's availability to true
        await ActiveDriver.findOneAndUpdate({ driverId: socket.user.userId }, { available: true });
  
        // Keep track of declined drivers
        ride.declinedDrivers = ride.declinedDrivers || [];
        ride.declinedDrivers.push(socket.user.userId);
        await ride.save();
  
        const nextDriver = await findNextAvailableDriver(ride.declinedDrivers);
        if (nextDriver) {
          const nextDriverSocketId = userSocketIds[nextDriver.driverId];
          if (nextDriverSocketId) {
            io.to(nextDriverSocketId).emit('rideRequested', { 
              rideId: ride._id, 
              riderId: ride.riderId, 
              riderName: ride.riderName 
            });
          } else {
            console.log("Next driver not connected", nextDriver.driverId);
          }
        } else {
          ride.status = 'declined';
          await ride.save();
          io.to(ride.riderId).emit('rideDeclined');
          console.log("Ride declined emitted to rider", ride.riderId);
        }
        console.log(`Driver ${socket.user.userId} ${data.accepted ? 'accepted' : 'declined'} ride request ${data.rideId}`);
      }
    } catch (error) {
      console.error('Error responding to ride request:', error);
    }
  });
  
  socket.on('completeRide', async (data) => {
    try {
      const ride = await Ride.findById(data.rideId);
      if (ride.driverId === socket.user.userId) {
        ride.status = 'completed';
        await ride.save();
        await ActiveDriver.findOneAndUpdate({ driverId: socket.user.userId }, { available: true });
        io.to(ride.riderId).emit('rideCompleted', ride);
        console.log(`Driver ${socket.user.userId} completed ride ${data.rideId}`);
      }
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  });

  socket.on('disconnect', async () => {
    // Find the user ID associated with the disconnecting socket
    const disconnectedUserId = Object.keys(userSocketIds).find(key => userSocketIds[key] === socket.id);
    if (disconnectedUserId) {
      console.log(`User with ID: ${disconnectedUserId} disconnected.`);
      delete userSocketIds[disconnectedUserId];

      // Additional logic to clean up after driver/rider disconnect
      if (socket.user && socket.user.userId) {
        await ActiveDriver.findOneAndDelete({ driverId: socket.user.userId });
        await Rider.findOneAndDelete({ riderId: socket.user.userId });
        const drivers = await ActiveDriver.find();
        const riders = await Rider.find();
        io.emit('update', { drivers, riders });
      }
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

async function findNextAvailableDriver(excludedDriverIds = []) {
  try {
    // Find the first available driver who is not in the excludedDriverIds list
    const driver = await ActiveDriver.findOne({ available: true, driverId: { $nin: excludedDriverIds } });
    if (!driver) {
      console.log('No available drivers');
    }
    return driver;
  } catch (error) {
    console.error('Error finding next available driver:', error);
    return null;
  }
}

app.get('/rides', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecretkey');
    const userId = decoded.user_id;

    const rides = await Ride.find({ riderId: userId });
    res.json({ rides });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});