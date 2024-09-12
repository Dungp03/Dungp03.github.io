console.log('Starting application...');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
require('dotenv').config();

console.log('Modules loaded');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log('Express and Socket.IO initialized');

// Cấu hình PeerServer
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerserver'
});

app.use('/peerjs', peerServer);

console.log('PeerServer configured');

// Serve static filesAA
app.use(express.static('public'));

console.log('Static files configured');

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('NGUOI_DUNG_DANG_KY', (data) => {
    console.log('User registered:', data);
    io.emit('DANH_SACH_ONLINE', [data]);
    socket.broadcast.emit('CO_NGUOI_DUNG_MOI', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    io.emit('USER_DISCONNECTED', socket.id);
  });
});

console.log('Socket.IO logic set up');

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log('Server listen called');
