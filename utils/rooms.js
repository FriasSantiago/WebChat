const rooms = [{name: "room1", capacity: 10}];

const addRoom = (roomName, capacity=10) => {
    if (!findRoom(roomName)) {
        const room = {
            name: roomName,
            capacity
        };

        rooms.push(room);
    }
};

const findRoom = roomName => rooms.find(room => room.name === roomName);

const hasSpace = (roomName, currentClients) => {
    return findRoom(roomName).capacity > currentClients
}

module.exports = {
    addRoom,
    findRoom,
    hasSpace
}