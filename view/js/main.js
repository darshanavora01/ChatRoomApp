
const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// User name from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chat room
socket.emit('joinRoom', {username, room});

//get room users
socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    printMessageToAll(message);

    //scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    //clear message after sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


function printMessageToAll(message) {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span> 9:12pm</span></p><p class="text"> ${message.text} </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}