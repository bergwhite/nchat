const io = require('./io.js').io
const server = require('./io.js').server
const mess = require('../database/model').mess;
const socketSession = require('express-session-socket.io')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')

const event = function (chatData, chatMethod, port) {

  // socket链接时执行
  io.on('connection', function (socket) {
    var data = cookie.parse(socket.handshake.headers.cookie);
    var sessionId = cookieParser.signedCookie(data['key'], 'whocarewhatisthepass');
    var sessionDir = '../../sessions/'
    var sessionExtension = '.json'
    try {
      const sessionFile = require(sessionDir + sessionId + sessionExtension)
      console.log('sessionFile.loginUser: ' + sessionFile.loginUser)
    } catch(e) {
      console.log('not login' + e);
    }
    // console.log(data)
    // console.log(sessionId)

    // 初始化房间ID
    chatData.currentRoomID = chatMethod.getCurrentRoomID(socket)
    // 发送请求当前房间号事件
    socket.emit('request room id')
    // 监听到相应后，存储当前的房间号
    socket.on('response room id', function (roomID) {
      // 读取当前房间的聊天信息
      var messShow = mess.find({'room': roomID}, function (err, data) {
        console.log('room data ready / ' + (data.lenth !== 0))
        socket.emit('show latest talk', data)
      })
      // 存储房间ID
      chatData.currentRoomID = roomID
      console.log('connection / currentRoom: ' + chatData.currentRoomID)
      // 不存在则创建新房间
      if(!chatMethod.isRoomExist(chatData.room, roomID)) {

        // here has been replaced, maybe the below code will be removed
        /*// 向当前接受请求的页面发送更新房间列表请求
        socket.emit('add room', roomID)
        // 向其他房间发送更新列表请求
        socket.broadcast.emit('add room', roomID)*/

        chatData.roomList.push(roomID)
        chatData.room.push({
          name: roomID,
          desc: null,
          user: [],
          img: []
        })
      }
      // 进入房间
      socket.join(roomID)
    })
    // 添加用户
    socket.on('user add req', function (id, msg) {
      chatMethod.addUserToRoom(msg.name,id, msg.img)
      console.log(msg)
      if (chatData.addUserStatus) {
        chatMethod.welcomeUser(id, '欢迎' + msg.name + '加入房间')
        socket.broadcast.to(id).emit('user add to list req', {name: msg.name, img: msg.img})
        chatData.socketID[socket.id] = msg.name
      }
      socket.emit('user add res', {
        status: chatData.addUserStatus,
        user: msg.name
      })
    })
    // 给指定房间发送消息
    socket.on('send message req', function (time, id, msg) {
      socket.broadcast.to(id).emit('send message res', msg)
      // 存储信息到数据库
      var newMess = new mess({
        room: id,
        user: msg.user,
        mess: msg.msg,
        time: time,
        img: msg.img
      })
      newMess.save()
    })
    // 显示当前状态
    socket.emit('current status', chatData)
    // 退出连接时的方法
    socket.on('disconnect', function () {
      // chatMethod.getCurrentRoomID(socket)
      chatData.currentRoomID = chatMethod.getCurrentRoomID(socket)
      chatData.currentRoomIndex = chatMethod.getCurrentRoomIndex(chatData.currentRoomID)
      if (chatData.socketID[socket.id] !== undefined) {
        chatMethod.delUserFromRoom(chatData.socketID[socket.id],chatData.currentRoomIndex)
        socket.broadcast.to(chatData.currentRoomID).emit('user logout req', {
          currentUser: chatData.socketID[socket.id],
          currentUserList: chatData.room[chatData.currentRoomIndex].user,
          currentUserListImg: chatData.room[chatData.currentRoomIndex].img
        })
      }
      console.log('disconnect / getCurrentRoomID / ' + chatData.currentRoomID)
      console.log('disconnect / getCurrentRoomIndex / ' + chatData.currentRoomIndex)
      console.log('disconnect / getCurrentUser  / ' + chatData.socketID[socket.id])
    });
  })
  server.listen(port)
  console.log('socket-server on ' + port)
}
module.exports = event