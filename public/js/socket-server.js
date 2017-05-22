const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
// 在线用户
var count = 0;
// 用户列表
var userList = [];

var logonList = [];
// 房间清单
var roomList = []
var status = null;
io.on('connection', function (socket) {
  console.log('One User Is Online')
  socket.emit('request room id')
  socket.on('response room id', function (data) {
    if (roomList.indexOf(data) === -1) {
      roomList.push(data)
    }
    socket.join(data)
    io.to(data).emit('init the room', {
      user: 'system',
      msg: 'welcome to the ' + data
    });
  })
  socket.emit('welcome', {hello: 'world', userList: userList, logonList: logonList})
  socket.on('user', function (data) {
    if(userList.indexOf(data.newUserName) === -1) {
      userList.push(data.newUserName)
      console.log(data.newUserName)
      status = true
      logonList.push(data.newUserName)
      socket.broadcast.emit('renderOnlineList', data.newUserName)
    } else {
      console.log(data.newUserName + 'is exist.')
      status = false
    }
    socket.emit('showUser', {status: status, userList: userList, logonList: logonList})
  })
  // io.emit('this', { will: 'be received by everyone'});
  // socket.on('private message', function (from, msg) {
  //   console.log('I received a private message by ', from, ' saying ', msg);
  // });
  socket.on('sendMessage', function (id, data) {
    socket.broadcast.to(id).emit('latestTalk', data)
    console.log(data)
  })
  socket.on('disconnect', function () {
    console.log('One User Is Offline')
    socket.emit('user disconnected');
  });
})
server.listen(81)
console.log('socket-server on 81')
