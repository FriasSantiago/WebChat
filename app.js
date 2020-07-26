const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { addUser, removeUser, getUserById, getUsersInRoom, getUserByName } = require('./utils/users');
const { send } = require('process');

const app = express();
const server = http.createServer(app);
const io = socketio(server);  

const PORT = process.env.PORT || 3000;

// Configura los archivos estaticos
app.use(express.static(__dirname + "/public"));

// Ejecuta cuando se conecta un usuario
io.on('connect', socket => {

    // Agrega el usuario a la sala
    socket.on("joinRoom", ({ username, room }) => {
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        socket.to(user.room).broadcast.emit("userAction", user.username + " has joined!");

        // Update a la lista de usuarios
        io.to(user.room).emit("roomClients", {
            clients: getUsersInRoom(user.room),
            room: user.room
        });
    });

    // Cuando se recibe un mensaje del usuario
    socket.on("message", msg => {
        const user = getUserById(socket.id);
        if (user) {
            io.in(user.room).emit("message", { sender: user.username, msg, isPrivate: false });
        }
    });

    socket.on("privateMessage", ({ to, msg }) => {
        const sender = getUserById(socket.id);
        const receiver = getUserByName(to, sender.room);

        if (receiver) {
            io.to(receiver.id).to(sender.id).emit("message", {
                msg,
                sender: sender.username,
                isPrivate: true
            });
        } else {
            socket.emit("message", {
                msg: "User not found!",
                sender: "AppBot",
                isPrivate: true
            })
        }
    });

    // Ejecuta cuando el usuario se desconecta
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("userAction", user.username + " has left!");
            io.to(user.room).emit("roomClients", getUsersInRoom(user.room));
        }
    });
});

// Inicializa el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}...`);
});