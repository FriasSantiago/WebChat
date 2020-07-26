const socket = io();

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit("joinRoom", { username, room });

socket.on("roomClients", ({ clients, room }) => {
    
    $(".room-name").html(room);

    $(".users-list").html("");
    for (let i = 0; i < clients.length; i++) {
        $(".users-list").append(`<li>${clients[i].username}</li>`);
    }
});

socket.on("message", ({ sender, msg, isPrivate }) => {
    if (sender === username && isPrivate) {
        $(".messages").append(` <div class="message">
                                    <small>${sender} <span>00:00</span> (Private)</small>
                                    <hr>
                                    <p>${msg}</p>
                                </div>`);
    } else if (isPrivate) {
        $(".messages").append(` <div class="message">
                                    <small>${sender} <span>00:00</span> (Private)</small>
                                    <hr>
                                    <p>${msg}</p>
                                </div>`);
    } else if (sender === username) {
        $(".messages").append(` <div class="message">
                                    <small>You <span>00:00</span></small>
                                    <hr>
                                    <p>${msg}</p>
                                </div>`);
    } else {    
        $(".messages").append(` <div class="message">
                                    <small>${sender} <span>00:00</span></small>
                                    <hr>
                                    <p>${msg}</p>
                                </div>`);
    };
});

socket.on("userAction", msg => {
    $(".messages").append(`<p>${msg}</p>`);
});

$(".msg-form").on("submit", e => {
    e.preventDefault();
    
    let msg = $(".msg").val();
    const regex = /\/[^\s].*/;

    if (regex.test(msg)) {
        let to = $(".msg").val().slice(1, msg.indexOf(" "));
        msg = $(".msg").val().slice(msg.indexOf(" "), msg.length);
        socket.emit("privateMessage", {to, msg});
    } else {
        socket.emit("message",  msg);
    }
    $(".msg").val(""); 
});

