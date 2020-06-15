var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs'); // required for file serving
var port = process.env.PORT || 5000;

app.use(express.static(__dirname));

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  socket.username = "Anonymouse";
  console.log(socket.username + ' connected');
  socket.on('change_username', (data) => {
    if (data.username == '') socket.username = 'Anonymouse';
    else socket.username = data.username;

    socket.broadcast.emit('chat message', '<span class="username">A new User ' + socket.username + ': Joined The Chatroom </span>');
    console.log("username = " + data.username);
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', '<span class="username">' + socket.username + ': </span>' + msg);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username });
  })

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  })


  //serving images

  socket.on('base64 file', function (msg) {
    console.log('received base64 file from' + socket.username);
    //console.log(msg.filename);
    // socket.broadcast.emit('base64 image', //exclude sender
    io.sockets.emit('base64 file',  //include sender

      {
        username: socket.username=='' ? 'Anonymouse' : socket.username,
        file: msg.file,
        fileName: msg.fileName
      }

    );
  });

  // io.on('connection', function(socket){
  //   try {
  //     fs.readFile(__dirname + '/images/rajesh.jpg', function(err, buf){
  //       socket.emit('image', { image: true, buffer: buf.toString('base64') });
  //       console.log('image file is initialized');
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }

  // });
});

