const socket = io();

// Get URL parameters for username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join user to the room selected
socket.emit("joinRoom", { username, room });

// Displays current room name and clients
socket.on("roomClients", ({ clients, room }) => {
    
    $(".room-name").html(room);

    $(".users-list").html("");
    for (let i = 0; i < clients.length; i++) {
        $(".users-list").append(`<li>${clients[i].username}</li>`);
    }
});

// Display messages sent/received
socket.on("message", ({ sender, msg, isPrivate, moment }) => {
    if (sender === username) {
        $(".messages").append(
            `<div class="message">
                <small>You: <span>${moment}</span> ${isPrivate ? "(Private)" : ""}</small>
                <hr>
                <p>${msg}</p>
            </div>`
        );
    } else {
        $(".messages").append(
            `<div class="message">
                <small>${sender} <span>${moment}</span> ${isPrivate ? "(Private)" : ""}</small>
                <hr>
                <p>${msg}</p>
            </div>`
        );
    }
    scrollBottom();    
});

// Displays when a user connects/disconnects
socket.on("userAction", msg => {
    $(".messages").append(`<p class=user-action>${msg}</p>`);
    scrollBottom(); 
});

// Get form input
$(".msg-form").on("submit", e => {
    e.preventDefault();
    
    let msg = $(".msg").val();
    const regex = /\/[^\s].*/;

    // TODO validate message
    if (regex.test(msg)) {  // Checks if the message is private
        let to = $(".msg").val().slice(1, msg.indexOf(" "));
        msg = $(".msg").val().slice(msg.indexOf(" "), msg.length);
        socket.emit("privateMessage", {to, msg});
    } else {
        socket.emit("message", msg);
    }
    $(".msg").val(""); 
});

const scrollBottom = () => {
    const msgs = $(".messages");
    msgs.scrollTop(msgs.prop("scrollHeight")) ;    
};                  