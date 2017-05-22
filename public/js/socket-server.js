const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)

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
  // 为用户添加状态
  // 在用户下线的时候可以进行判断
  socketID: {},
  // 添加用户的状态
  addUserStatus: null,
  currentRoom: null
}

// 方法
chat.method = {
  // 判断当前房间是否存在
  isRoomExist: function (arr, roomID) {
    var a = arr.filter(function(val){
      if(val.name === roomID) {
        console.log(val.name)
        return true
      }
    })
    return a.length !== 0
  },
  // 添加用户到指定房间
  addUserToRoom: function (name, roomID) {
    chat.data.room.findIndex(function(val,index){
      if(val.name === roomID) {
        chat.data.room[index].user.push(name)
      }
    })
  },
  welcomeUser: function (roomID, msg) {
    // 为当前房间发送欢迎消息
    io.to(roomID).emit('welcome the user', msg);
  }
}

// socket链接时执行
io.on('connection', function (socket) {
  // 发送请求当前房间号事件
  socket.emit('request room id')
  // 监听到相应后，存储当前的房间号
  socket.on('response room id', function (roomID) {
    chat.data.currentRoom = roomID
    console.log('cccccccccccc: ' + chat.data.currentRoom)
    // 不存在则创建新房间
    if(!chat.method.isRoomExist(chat.data.room, roomID)) {
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
    // 当前用户未曾添加则添加成功
    if(chat.data.user.indexOf(msg.name) === -1) {
      chat.data.user.push(msg.name)
      chat.data.addUserStatus = true
      socket.broadcast.to(id).emit('renderOnlineList', msg.name)
      chat.method.welcomeUser(id, '欢迎' + msg.name + '加入房间')
      chat.data.socketID[socket.id] = msg.name
    }
    // 当前用户已添加则添加失败
    else {
      chat.data.addUserStatus = false
    }
    socket.emit('showUser', chat.data)
  })
  // 给指定房间发送消息
  socket.on('send message', function (id, msg) {
    socket.broadcast.to(id).emit('latestTalk', msg)
  })
  // 显示当前状态
  socket.emit('current status', chat.data)
  // 退出连接时的方法
  socket.on('disconnect', function () {
    // TODO: not work
    if (chat.data.socketID[socket.id] !== 'undefined') {
      console.log(chat.data.socketID[socket.id] + ' had gone.')
    }
    socket.emit('request logout user')
    socket.on('response logout user', function (msg) {
      console.log(msg + ' is gone.')
    })
  });
})
// 监听81端口
server.listen(81)
console.log('socket-server on 81')
