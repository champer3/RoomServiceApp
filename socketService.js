import io from 'socket.io-client';
import { SERVER_URL } from './config';

let socket = null;

export const initializeSocket = (token) => {
  console.log('[SocketService] initializeSocket called, existing socket:', socket ? 'yes' : 'no');
  if (socket) {
    console.log('[SocketService] Socket already exists, connected:', socket.connected);
    return;
  }
  
  console.log('[SocketService] Creating new socket to:', SERVER_URL);
  socket = io(SERVER_URL, {
    query: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[SocketService] CONNECTED, id:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[SocketService] DISCONNECTED, reason:', reason);
  });

  socket.on('connect_error', (err) => {
    console.log('[SocketService] CONNECTION ERROR:', err.message);
  });

  socket.onAny((event, ...args) => {
    console.log('[SocketService] RECEIVED event:', event, args);
  });
};

export const getSocket = () => {
  console.log('[SocketService] getSocket called, socket:', socket ? 'exists' : 'NULL', ', connected:', socket?.connected);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
