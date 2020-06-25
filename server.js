const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const customMessage = require('./utils/messages');
const {addToUsers, getCurrentUser, userLeavesRoom, getRoomUsers} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 8000 || process.env.PORT;

app.use(express.static(path.join('view')));

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = addToUsers(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', customMessage('Admin','Welcome to the room'));

        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                customMessage('Admin', `${user.username} has joined the room`)
            );

        //  send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', customMessage(user.username,msg));
    });

    socket.on('disconnect', () => {
        const user = userLeavesRoom(socket.id);
    
        if (user) {
            io.to(user.room).emit(
                'message',
                customMessage('Admin', `${user.username} has left the chat`)
            );
        
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(port, function (){
    console.log('App is running on port', port);
});