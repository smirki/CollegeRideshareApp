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
  driversToAsk: [String],
  pickup: {
    latitude: Number,
    longitude: Number,
  },
  destination: {
    latitude: Number,
    longitude: Number,
  },
});
const Ride = mongoose.model('Ride', rideSchema);

const activeDriverSchema = new mongoose.Schema({
  driverId: String,
  available: Boolean,
  status: String,
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
        console.log(userSocketIds);
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
      // Get the list of available driver IDs
      const availableDrivers = await ActiveDriver.find({ available: true }).select('driverId -_id');
      const driverIds = availableDrivers.map(driver => driver.driverId);
  
      // Create a new ride with the list of drivers to ask and the coordinates
      const ride = await Ride.create({
        riderId: data.userId,
        status: 'pending',
        driversToAsk: driverIds,
        pickup: data.pickup,
        destination: data.destination,
      });
  
      // Send the ride request to the first driver in the list with the coordinates
      if (driverIds.length > 0) {
        const firstDriverSocketId = userSocketIds[driverIds[0]];
        if (firstDriverSocketId) {
          io.to(firstDriverSocketId).emit('rideRequested', {
            rideId: ride._id,
            riderId: data.userId,
            riderName: socket.user.name,
            pickup: data.pickup,
            destination: data.destination,
          });
        }
      } else {
        // No available drivers, emit 'rideDeclined' to the rider
        const riderSocketId = userSocketIds[data.userId];
        if (riderSocketId) {
          io.to(riderSocketId).emit('rideDeclined');
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
        console.log("Ride Accepted - Server");
        ride.driverId = socket.user.userId;
        ride.status = 'accepted';
        await ride.save();
        await ActiveDriver.findOneAndUpdate({ driverId: socket.user.userId }, { status: 'driving' });
        const riderSocketId = userSocketIds[ride.riderId];
        if (riderSocketId) {
          io.to(riderSocketId).emit('rideAccepted', { driverId: socket.user.userId });
          console.log("Ride accepted emitted to rider", ride.riderId);
        } else {
          console.log("Rider not connected", ride.riderId);
        }
        io.to(userSocketIds[socket.user.userId]).emit('rideAccepted', { rideId: ride._id }); // Send rideAccepted to the driver as well
      } else {
        // Remove the current driver from the driversToAsk list
        ride.driversToAsk = ride.driversToAsk.filter(driverId => driverId !== socket.user.userId);
        await ride.save();
  
        // Send the ride request to the next driver in the list
        if (ride.driversToAsk.length > 0) {
          const nextDriverSocketId = userSocketIds[ride.driversToAsk[0]];
          if (nextDriverSocketId) {
            io.to(nextDriverSocketId).emit('rideRequested', {
              rideId: ride._id,
              riderId: ride.riderId,
              riderName: ride.riderName
            });
          }
        } else {
          // No more drivers to ask, emit 'rideDeclined' to the rider
          const riderSocketId = userSocketIds[ride.riderId];
          if (riderSocketId) {
            io.to(riderSocketId).emit('rideDeclined');
          }
        }
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
        io.to(userSocketIds[socket.user.userId]).emit('rideCompleted', { rideId: ride._id }); // Send rideCompleted to the driver as well
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
  socket.on('endDrive', async (data) => {
    try {
      await ActiveDriver.findOneAndUpdate({ driverId: data.driverId }, { status: 'available', available: true });
      const ride = await Ride.findOne({ driverId: data.driverId, status: 'accepted' });
      if (ride) {
        ride.status = 'completed';
        await ride.save();
        io.to(ride.riderId).emit('rideCompleted', { rideId: ride._id });
      }
    } catch (error) {
      console.error('Error ending drive:', error);
    }
  });
});

async function findNextAvailableDriver(excludedDriverIds = []) {
  try {
    // Find the first available driver who is not in the excludedDriverIds list
    const driver = await ActiveDriver.findOne({
      available: true,
      driverId: { $nin: excludedDriverIds }
    });
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
