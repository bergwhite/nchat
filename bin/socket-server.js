const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
var mess = require('../database').mess;

var chat = {}

// 数据
chat.data = {
  // 所有在线用户
  user: [],
  // 所有聊天室
  room: [{
    // 名字
    name: 'Chat Room',
    // 描述
    desc: null,
    // 用户
    user: []
  }],
  roomList: ['Chat Room'],
  // 为用户添加状态
  // 在用户下线的时候可以进行判断
  socketID: {},
  // 添加用户的状态
  addUserStatus: null,
  currentRoomID: null,
  currentRoomIndex: null
}

// 方法
chat.method = {
  // 初始化房间索引
  getCurrentRoomIndex: function (roomID) {
    return chat.data.room.findIndex(function(val,index){
      console.log('name: ' + val.name)
      console.log('roomID: ' + roomID)
      return val.name === roomID
    })
  },
  // 获取当前房间ID
  getCurrentRoomID: function (socket) {
    var URI = socket.request.headers.referer
    var decodeURI = URI.match(/room\/(.*)?/)
    return decodeURI === null ? 'Chat Room' : decodeURIComponent(decodeURI[1].replace('/',''))
  },
  // 判断当前房间是否存在
  isRoomExist: function (arr, roomID) {
    var a = arr.filter(function(val){
      if(val.name === roomID) {
        return true
      }
    })
    return a.length !== 0
  },
  // 添加用户到指定房间
  addUserToRoom: function (name, roomID) {
    chat.data.room.findIndex(function(val,index){
      if(val.name === roomID) {
        if(chat.data.room[index].user.indexOf('name') === -1) {
          chat.data.room[index].user.push(name)
          chat.data.addUserStatus = true
        }
        else {
          chat.data.addUserStatus = false
        }
      }
    })
  },
  // 删除指定房间用户
  delUserFromRoom: function (user, roomIndex) {
    var userIndex = chat.data.room[roomIndex].user.indexOf(user)
    // 从房间中移除
    chat.data.room[roomIndex].user.splice(userIndex, 1)
  },
  welcomeUser: function (roomID, msg) {
    // 为当前房间发送欢迎消息
    io.to(roomID).emit('welcome the user', msg);
  }
}

// socket链接时执行
io.on('connection', function (socket) {
  // 初始化房间ID
  chat.data.currentRoomID = chat.method.getCurrentRoomID(socket)
  // 发送请求当前房间号事件
  socket.emit('request room id')
  // 监听到相应后，存储当前的房间号
  socket.on('response room id', function (roomID) {
    chat.data.currentRoomID = roomID
    console.log('connection / currentRoom: ' + chat.data.currentRoomID)
    // 不存在则创建新房间
    if(!chat.method.isRoomExist(chat.data.room, roomID)) {
      // 向当前接受请求的页面发送更新房间列表请求
      socket.emit('showRoom', roomID)
      // 向其他房间发送更新列表请求
      socket.broadcast.emit('showRoom', roomID)
      chat.data.roomList.push(roomID)
      chat.data.room.push({
        name: roomID,
        desc: null,
        user: []
      })
    }
    // 进入房间
    socket.join(roomID)
  })
  // 添加用户
  socket.on('add user', function (id, msg) {
    chat.method.addUserToRoom(msg.name,id)
    console.log(msg)
    if (chat.data.addUserStatus) {
      chat.method.welcomeUser(id, '欢迎' + msg.name + '加入房间')
      socket.broadcast.to(id).emit('renderOnlineList', msg.name)
      chat.data.socketID[socket.id] = msg.name
    }
    socket.emit('showUser', {
      status: chat.data.addUserStatus,
      user: msg.name
    })
  })
  // 给指定房间发送消息
  socket.on('send message', function (time, id, msg) {
    socket.broadcast.to(id).emit('latestTalk', msg)
    var newMess = new mess({
      room: id,
      user: msg.user,
      mess: msg.msg,
      time: time
    })
    newMess.save()
  })
  // 显示当前状态
  socket.emit('current status', chat.data)
  // 退出连接时的方法
  socket.on('disconnect', function () {
    // chat.method.getCurrentRoomID(socket)
    chat.data.currentRoomID = chat.method.getCurrentRoomID(socket)
    chat.data.currentRoomIndex = chat.method.getCurrentRoomIndex(chat.data.currentRoomID)
    if (chat.data.socketID[socket.id] !== undefined) {
      chat.method.delUserFromRoom(chat.data.socketID[socket.id],chat.data.currentRoomIndex)
      socket.broadcast.to(chat.data.currentRoomID).emit('request user logout', {
        currentUser: chat.data.socketID[socket.id],
        currentUserList: chat.data.room[chat.data.currentRoomIndex].user
      })
    }
    console.log('disconnect / getCurrentRoomID / ' + chat.data.currentRoomID)
    console.log('disconnect / getCurrentRoomIndex / ' + chat.data.currentRoomIndex)
    console.log('disconnect / getCurrentUser  / ' + chat.data.socketID[socket.id])
  });
})
// 监听8089端口
server.listen(8089)
console.log('socket-server on 8089')
