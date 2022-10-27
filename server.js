//using express.js + node.js +scoket.io
const express = require('express');
// make express
const app =  express();
//require http and start expree
const http= require('http').createServer(app);
//starting port at 3000
const PORT= process.env.PORT || 3000
// starting port and listen
http.listen(PORT, () => {
    console.log(`running ${PORT}`)
})
// use expree.static for connection in under the public file clients.js
app.use(express.static(__dirname + '/public'))
// learning index.html file in the main server server.js
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

//socket
//import socket.io
const io = require('socket.io')(http)
//adding user ids in users array
 const users = {};
 // call function for socket.io
 // io on and take connnection
io.on('connection', (socket) => {
    //this function was call when new user was joined the chat 
    socket.on('new-user-joined' , name => {
        users[socket.id] = name;
        //socket broadcat was amit when new user joined 
        //like all knows when new user joined
        socket.broadcast.emit('user-joined', name);
    });
    // user send call functon
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name : users[socket.id]})
    });
    //user disconnet when user end the caht
    //call function run 
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', {message: message, name : users[socket.id]});
        delete users[socket.id];
    })
})