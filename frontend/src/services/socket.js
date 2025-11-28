import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    socket = io(backendUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinLeaderboardRoom = (userId) => {
  if (socket && socket.connected) {
    socket.emit('join_leaderboard', userId);
  }
};

export const onLeaderboardUpdate = (callback) => {
  if (socket) {
    socket.on('leaderboard_update', callback);
  }
};

export const offLeaderboardUpdate = () => {
  if (socket) {
    socket.off('leaderboard_update');
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  connectSocket,
  disconnectSocket,
  joinLeaderboardRoom,
  onLeaderboardUpdate,
  offLeaderboardUpdate,
  getSocket
};
