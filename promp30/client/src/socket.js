import { io } from 'socket.io-client';

let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      withCredentials: false
    });
    
    socket.on('connect_error', (err) => {
      console.log('Connection error, fallback to polling:', err.message);
      socket.io.opts.transports = ['polling'];
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
