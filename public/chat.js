const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const wrap = document.getElementsByClassName("chat-sidebar")[0];
const control = document.getElementsByClassName("icon")[0];
var i = [];

// Togle menu
window.addEventListener('resize', () => {
    if(window.innerWidth > 700) {
        wrap.style.display = "block";
        i = [];
        i.push(0);
    }
    if(window.innerWidth < 700 && i[0] == 0) {
        wrap.style.display = "none";
        i = [];
        i.push(1);
    }
});

control.addEventListener('click', (e) => {
    if (wrap.style.display == "block") {
        wrap.style.display = "none";
    } else {
        wrap.style.display = "block";
    }
});


// Login Management
document.addEventListener('DOMContentLoaded', () => {
    redirect();
});

let usuario = {};

function redirect() {
    let store = localStorage.getItem('authorization-token');
    // const url = 'http://localhost:5000/chat';
    const url = 'http://192.168.0.14:5000/chat';

    const options = {
        method: 'POST',
        headers: new Headers( { 'authorization-token': store } ),
    }

    fetch(url, options).then(res => {
        if(res.status == 200) {
            document.body.style.display = 'block'; 
            usuario.username = res.headers.get('username');
            usuario.room = res.headers.get('room');
        } else {
            res.text().then(data => {
                document.body.style.display = 'block';
                document.body.innerHTML =
                `<div class="modal">
                    <div class="modal-content">
                        <span>&times;</span>
                        <h2 class="warning">${data} </h2>
                        <h3>Return to main page: 
                        <a href="/" class="back">here</a></h3>
                    </div>
                </div>`;

                let modal = document.getElementsByClassName("modal")[0];
                let mCont = document.getElementsByClassName("modal-content")[0];
                let btn = document.getElementsByTagName("span")[0];
                modal.style.display = "block";
                btn.addEventListener('click', () => {
                    mCont.style.animationName = "hide";
                    modal.style.animationName = "unfade";
                    setTimeout(() => {
                        modal.style.display = "none";
                        location.href = '/';
                    }, 1000);
                });
            });
        }     
    });
}

// Logout
setTimeout(removeStorage, 1110000);

function removeStorage() {
    localStorage.removeItem("authorization-token");
}

const socket = io();

// Join chatroom
const call = setInterval(() => {
    if(usuario.username) {
        socket.emit('joinRoom', { username: usuario.username, room: usuario.room });
        clearInterval(call);
    }
}, 20);

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Messages from database
socket.on('messages', ({ msgs, user }) => {
    console.log(user);
    outputMessages(msgs, user);


    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;
    if(msg.length > 100) {
        alert('Message is longer than the maximum allowed length (100)');
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
        return;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    let logged = 'bot';
        if(message.username != 'ChatCord Bot') {
            logged = 'logged';
        }
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta ${logged}">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output messages to DOM
function outputMessages(messages, user) {
    for(let i = 0; i < messages.length; i++) {
        let logged = 'not';
        if(messages[i].username == user) {
            logged = 'logged';
        }

        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta ${logged}">${messages[i].username} <span>${messages[i].time}</span></p>
        <p class="text">
            ${messages[i].msg}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    }
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users name to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user}</li>`).join('')}`;
}