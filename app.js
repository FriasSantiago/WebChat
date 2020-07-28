const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { addUser, removeUser, getUserById, getUsersInRoom, getUserByName } = require('./utils/users');
const { formatMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);  

const PORT = process.env.PORT || 3000;

// Use static files
app.use(express.static(__dirname + "/public"));

// Initializes socket
io.on('connect', socket => {

    // Add user to room
    socket.on("joinRoom", ({ username, room }) => {
        // TODO check if username is taken
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        socket.to(user.room).broadcast.emit("userAction", user.username + " has joined!");

        // Update users list and send it back to the client
        io.to(user.room).emit("roomClients", {
            clients: getUsersInRoom(user.room),
            room: user.room
        });
    });

    // Get user message
    socket.on("message", msg => {
        const user = getUserById(socket.id);
        if (user) {
            io.in(user.room).emit("message", formatMessage({
                sender: user.username,
                msg,
                isPrivate: false 
            }));
        }
    });

    // Get private message
    socket.on("privateMessage", ({ to, msg }) => {
        const sender = getUserById(socket.id);
        const receiver = getUserByName(to, sender.room);

        if (receiver) {
            io.to(receiver.id).to(sender.id).emit("message", formatMessage({
                    sender: sender.username,    
                    msg, 
                    isPrivate: true
                }));
        } else {
            socket.emit("message", formatMessage({
                sender: "AppBot",
                msg: "User not found!",
                isPrivate: true
            }));
        }
    });

    // When user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("userAction", user.username + " has left!");
            io.to(user.room).emit("roomClients", getUsersInRoom(user.room));
        }
    });
});

// Run server
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}...`);
});