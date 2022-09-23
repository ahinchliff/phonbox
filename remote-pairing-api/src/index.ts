import http from 'http';
import { Server as SocketServer } from 'socket.io';
import getConfig from './config';

const config = getConfig();

const httpServer = http.createServer();

const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['*'],
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    if (socket.data.userId) {
      console.log('User disconnected', socket.data.userId);
    } else if (socket.data.pairingCode) {
      console.log('Card disconnected', socket.data.pairingCode);
      io.in(socket.data.pairingCode).disconnectSockets(true);
    } else {
      console.log('Unknown type disconnected');
    }
  });

  socket.on('REGISTER', (userId) => {
    console.log('Received event: REGISTER', { userId });
    socket.data.userId = userId;
    socket.emit('REGISTER');
  });

  socket.on(
    'NEW_PAIRING_REQUEST',
    async (userId: string, pairingCode: string, message: string) => {
      console.log('Received event: NEW_PAIRING_REQUEST', {
        userId,
        pairingCode,
        message,
      });

      const sockets = await io.fetchSockets();
      const counterpartySocket = sockets.find(
        (socket) => socket.data.userId === userId
      );

      counterpartySocket?.emit('NEW_PAIRING_REQUEST', pairingCode, message);
    }
  );

  socket.on('JOIN_PAIRING', (pairingCode: string) => {
    socket.data.pairingCode = pairingCode;
    console.log('Received event: JOIN_PAIRING', { pairingCode });
    let roomMembers = io.sockets.adapter.rooms.get(pairingCode);
    let numberOfRoomMembers = roomMembers ? roomMembers.size : 0;

    if (numberOfRoomMembers !== 0 && numberOfRoomMembers !== 1) {
      return console.error('Cant join a room with this number of members', {
        numberOfRoomMembers,
      });
    }

    socket.join(pairingCode);
    socket.data.pairingCode = pairingCode;
    socket.emit('ROOM_JOINED');

    roomMembers = io.sockets.adapter.rooms.get(pairingCode);
    numberOfRoomMembers = roomMembers ? roomMembers.size : 0;

    if (numberOfRoomMembers === 1) {
      return console.log('Waiting on counterparty', { pairingCode });
    } else {
      for (const roomMemberClientId of roomMembers!) {
        const client = io.sockets.sockets.get(roomMemberClientId);
        client?.emit(
          'COUNTER_PARTY_CONNECTED',
          roomMemberClientId === socket.id
        );
      }
    }
  });

  socket.on('PAIR_STEP_ONE', (cardCert: string) => {
    console.log('Received event: PAIR_STEP_ONE', { cardCert: !!cardCert });
    socket.broadcast
      .to(socket.data.pairingCode)
      .emit('PAIR_STEP_ONE', cardCert);
  });

  socket.on('PAIR_STEP_TWO', (data: string) => {
    console.log('Received event: PAIR_STEP_TWO', { data: !!data });
    socket.broadcast.to(socket.data.pairingCode).emit('PAIR_STEP_TWO', data);
  });

  socket.on('PAIR_STEP_THREE', (data: string) => {
    console.log('Received event: PAIR_STEP_THREE', { data: !!data });
    socket.broadcast.to(socket.data.pairingCode).emit('PAIR_STEP_THREE', data);
  });

  socket.on('PAIR_STEP_FOUR', (data: string) => {
    console.log('Received event: PAIR_STEP_FOUR', { data: !!data });
    socket.broadcast.to(socket.data.pairingCode).emit('PAIR_STEP_FOUR', data);
  });

  socket.on('PAIRED', () => {
    console.log('Received event: PAIRED');
    io.in(socket.data.pairingCode).emit('PAIRED');
  });

  socket.on('TRANSFER_PHONON', (transferPacket: string) => {
    console.log('Received event: TRANSFER_PHONON', {
      transferPacket: !!transferPacket,
    });
    socket.broadcast
      .to(socket.data.pairingCode)
      .emit('TRANSFER_PHONON', transferPacket);
  });

  socket.on('PHONON_TRANSFER_SUCCESS', () => {
    console.log('Received event: PHONON_TRANSFER_SUCCESS');
    socket.broadcast
      .to(socket.data.pairingCode)
      .emit('PHONON_TRANSFER_SUCCESS');
  });

  socket.on('UNPAIR', () => {
    console.log('Received event: UNPAIR');
    for (const room of socket.rooms.values()) {
      let roomMembers = io.sockets.adapter.rooms.get(room);
      console.log(roomMembers);
      io.in(room).disconnectSockets(true);
    }
  });
});

httpServer.listen(config.port, () => {
  console.log(`Listening on port:${config.port}`);
});
