const socket = io("http://localhost:8000");

// Get DOM elements in respective JS variables.
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio that will play after receiving messages.
var audio = new Audio("sounds/notification.wav");

//Function which will append event info that is basically message details to the container.
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position === "left") audio.play();
};

//Ask new users for his/her name and let the server know.
const names = prompt("Enter your name to join the discussion room");
if (names == "") {
  names = null;
}
socket.emit("new-user-joined", names);

// If a new user joins receive his/her name from the server and append the info to the container.
socket.on("user-joined", (name) => {
  if (name != null) {
    append(`${name} joined the chat`, "left");
  }
});

// If server sends a message receive it and append the info to the container.
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});
// If a user leaves the chat, append the info to the container.
socket.on("left", (name) => {
  if (name != null) {
    append(`${name} left the chat`, "left");
  }
});

// If form gets submitted, send server the message.
form.addEventListener("submit", (e) => {
  if (names != null) {
    //If your name is not there than you can't see or send messages in the room.
    e.preventDefault();
    const message = messageInput.value;
    if (message !== "") {
      //You can't send empty messages.
      append(`You: ${message}`, "right");
      socket.emit("send", message);
      messageInput.value = "";
    }
  }
});
