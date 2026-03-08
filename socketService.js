import io from 'socket.io-client';

import { SERVER_URL } from './config';

let socket;

const initializeSocket = async (token) => {
  try {
    if (!socket) {
      socket = io(SERVER_URL, {
        query: { token },
        transports: ['websocket'], 
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

    }
  } catch (error) {
    console.error('Error initializing socket:', error);
  }
};

const getSocket = () => {
  if (!socket) {
    console.warn('Socket is not initialized. Please call initializeSocket first.');
  }
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { initializeSocket, getSocket, disconnectSocket };