const io = require('./io.js').io
const server = require('./io.js').server
const mess = require('../database/model').mess;
const info = require('../database/model').info;
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
    var loginUser = ''
    var roomID = chatMethod.getCurrentRoomID(socket)
    var userImg = ''
    console.log('当前房间 / ' + roomID)
    try {
      const sessionFile = require(sessionDir + sessionId + sessionExtension)
      loginUser = sessionFile.loginUser
      info.findOne({user: loginUser}, function(err, val){
        if (err) {
          console.log(err)
        }
        else if (val !== null) {
          userImg = val.img
          console.log(userImg)
        }
      })
      console.log('sessionFile.loginUser: ' + loginUser)
      console.log('userImg: ' + userImg)
      // console.log(socket)
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
    // 给指定房间发送消息
    socket.on('send message req', function (time, id, msg) {
      msg.user = loginUser
      msg.img = userImg
      socket.broadcast.to(id).emit('send message res', msg)
      // 存储信息到数据库
      var newMess = new mess({
        room: id,
        user: loginUser,
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
      socket.broadcast.to(chatData.currentRoomID).emit('user logout req', {
        currentUser: loginUser,
        currentUserList: chatData.room[chatData.currentRoomIndex].user,
        currentUserListImg: chatData.room[chatData.currentRoomIndex].img
      })
      console.log('disconnect / getCurrentRoomID / ' + chatData.currentRoomID)
      console.log('disconnect / getCurrentRoomIndex / ' + chatData.currentRoomIndex)
      console.log('disconnect / getCurrentUser  / ' + loginUser)
    });
  })
  server.listen(port)
  console.log('socket-server on ' + port)
}
module.exports = event