var express = require('express');
var socket = require('socket.io');
var app = express();


var server = app.listen(8888, function(){
    console.log('listening for requests on port 8888');
})

var con = []
var viewer = []

var io = socket(server);

app.set('view engine', 'ejs')
app.use(express.static('static'));

app.get('/room1', function(req,res){
  res.render('index')
})

app.get('/room2',function(req,res){
  res.render('room')
})

  io.on('connection', function(socket){
      console.log('made socket connection:', socket.id)

      viewer.push(socket)

      console.log('viewer',viewer.length)

      socket.on('chat', function(data){
          io.sockets.emit('chat', data)
                con.push(socket)
        console.log('chatters:',con.length)
        if(viewer.length > 0){
        viewer.length--}
        else {viewer.length = 0}
        console.log('Only viewing:',viewer.length)
      })
      socket.on('typing', function(data){
          socket.broadcast.emit('typing', data)
      })
      socket.on('disconnect', function(data){
        console.log('dissconnected user:',socket.id)
        if(con.length > 0){
        con.length--}
        else {con.length = 0}
        console.log('chatting:',con.length);
          console.log('only viewing:',viewer.length);
      })
  })
