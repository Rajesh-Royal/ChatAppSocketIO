var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('a user connected');
     
    socket.username = "Anonymouse";
    socket.on('change_username', (data) => {
        if(data.username == '') socket.username = 'Anonymouse';
        else socket.username = data.username;

        socket.broadcast.emit('chat message', '<span class="username">A new User '+socket.username+': Joined The Chatroom </span>');
        console.log("username = " + data.username);
    })
      socket.on('chat message', (msg) => {
        io.emit('chat message', '<span class="username">'+socket.username+': </span>' + msg);
      });

      socket.on('typing', (data) => {
          socket.broadcast.emit('typing', {username: socket.username});
      })
    
      socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      })
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});