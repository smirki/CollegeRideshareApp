const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const messages = [];

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  console.log('Token received:', token);

  if (!token) {
    console.log('Connection rejected: Token is required');
    return next(new Error('Token is required'));
  }

  try {
    const decoded = jwt.verify(token, 'mysecretkey');
    socket.user = {
      _id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
    };
    console.log('User information:', socket.user);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send all previous messages to the newly connected client
  socket.emit('previous messages', messages);

  socket.on('new message', (message) => {
    console.log('Message received:', message);
    message._id = uuidv4(); // This is the message ID
    message.createdAt = new Date().toISOString();
  
    // No need to overwrite message.user if it already comes with the _id
    messages.push(message);
  
    // Emit the message to all clients including the sender
    io.emit('new message', message);
  });
  

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', reason);
  });
});

server.listen(2053, () => {
  console.log('Server is running on port 2053');
});