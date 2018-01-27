const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'))

io.on('connection', function(socket){
    // console.log('connected');
    socket.on('chat message', function(msg){
        // console.log('received message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
