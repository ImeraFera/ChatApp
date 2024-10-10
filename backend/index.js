const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let onlineUsers = [];
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı : ', socket.id);

    socket.on('user_connected', (onlineUser) => {

        if (!onlineUsers.some(user => user.id === onlineUser.id)) {

            onlineUser.socket = socket.id;
            onlineUsers.push(onlineUser);
            io.emit('online_users', onlineUsers);
        }
    });

    socket.on('send_message', (message) => {

        if (message.roomName) {
            console.log(message.sender.username, ': ', message.content);
            io.to(message.roomName).emit('receive_message', message);
        } else {
            console.error('Room name is not specified');
        }
    });


    socket.on('join_room', (data) => {
        const { roomName, user } = data;
        socket.join(roomName);
        console.log(`${user.username} odaya katıldı: ${roomName}`);

    })

    socket.on('disconnect', () => {

        console.log('Bir kullanıcı ayrıldı', socket.id);

        onlineUsers = onlineUsers.filter(user => user.socket !== socket.id);

        io.emit('online_users', onlineUsers);

    });
});

server.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});
