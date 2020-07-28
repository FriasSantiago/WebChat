const users = [];

function addUser(id, username, room) {
        
    const user = { id, username, room };
    users.push(user);

    return user
}

function removeUser(id) {

    const i = users.findIndex(u => u.id === id);
    
    if (i !== -1) {
        return users.splice(i, 1)[0];
    }

}

function getUserById(id) {
    let found = false;
    let i = 0;
    let len = users.length;
    let user;

    while(i < len && !found) {
        if (users[i].id === id) {
            found = true;
            user = users[i];
        }
        i++;
    }

    return user;
}

function getUsersInRoom(room) {
    return users.filter(u => u.room === room);
}

function getUserByName(name, room) {
    return users.find(u => u.username === name && u.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getUsersInRoom,
    getUserByName
}