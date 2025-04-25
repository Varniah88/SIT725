const socket = io(); // Connect to the Socket.IO server

socket.on('message', (data) => {
  console.log('Message from server:', data);

  const messageBox = document.getElementById('message-box');
  if (messageBox) {
    messageBox.textContent = data;
  }
});
