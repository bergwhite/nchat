const io = require('./io.js').io
const server = require('./io.js').server
const mess = require('../database/model').mess;
const info = require('../database/model').info;
const cookie = require('cookie')
const cookieParser = require('cookie-parser')

const event = function (chatData, chatMethod, port) {

  // socket链接时执行
  io.on('connection', (socket) =>  {
    const cookieData = cookie.parse(socket.handshake.headers.cookie);
    const sessionId = cookieParser.signedCookie(cookieData['key'], 'whocarewhatisthepass');
    const sessionDir = '../../sessions/'
    const sessionExtension = '.json'
    const currentRoomName = chatMethod.getCurrentRoomID(socket)
    let loginedUserName = ''
    let loginedUserImg = ''
    socket.join(currentRoomName)  // 进入房间
    try {

      // 查询session中保存的用户名
      const sessionFile = require(sessionDir + sessionId + sessionExtension)
      loginedUserName = sessionFile.loginUser

      // 通过session中的用户名在数据库中查询用户信息
      info.findOne({user: loginedUserName}, (err, val) => {

        // 如果出错则打印出来
        if (err) {
          console.log('findInfoFromDB / err : ' + err)
        }

        // 如果查询到用户数据则保持图片Url到loginedUserImg变量里
        else if (val !== null) {
          loginedUserImg = val.img
          console.log('currentRoomName: ' + currentRoomName)
          console.log('findInfoFromDB / loginedUserName: ' + loginedUserName)
          console.log('findInfoFromDB / loginedUserImg: ' + loginedUserImg)
        }
      })

      // 如果捕获到错误则报错
    } catch(err) {
      console.log('sessionFile / err: ' + err);
    }

    // 初始化房间
    chatData.currentRoomName = chatMethod.getCurrentRoomID(socket)

    // 发送请求当前房间号事件
    socket.emit('room id req')

    // 监听到相应后，存储当前的房间号
    socket.on('room id res', (currentRoomName) => {

      // 读取当前房间的聊天信息
      mess.find({'room': currentRoomName}, (err, data) =>  {
        console.log('room data ready / ' + (data.lenth !== 0))
        socket.emit('mess show res', data)
      })

      // 存储房间ID
      chatData.currentRoomName = currentRoomName
      console.log('connection / currentRoom: ' + chatData.currentRoomName)

      // 不存在则创建新房间
      if(!chatMethod.isRoomExist(chatData.room, currentRoomName)) {
        chatData.roomList.push(currentRoomName)
        chatData.room.push({
          name: currentRoomName,
          desc: null,
          user: [],
          img: []
        })
      }
    })

    // 处理发送消息事件
    socket.on('send message req', (time, id, msg) => {
      const newUser = msg.user || loginedUserName
      const newImg = msg.img || loginedUserImg
      msg.user = loginedUserName
      msg.img = loginedUserImg
      // 把消息广播到相同房间
      socket.broadcast.to(id).emit('send message res', msg)
      // 存储消息到数据库
      const messEntity = new mess({
        room: id,
        user: newUser,
        mess: msg.msg,
        time: time,
        img: newImg
      })
      messEntity.save()
    })

    // 发送用于调试的状态信息
    socket.emit('current status', chatData)

    // 处理断开连接事件
    socket.on('disconnect', () => {

      // 重新获取房间名称和索引
      chatData.currentRoomName = chatMethod.getCurrentRoomID(socket)
      chatData.currentRoomIndex = chatMethod.getCurrentRoomIndex(chatData.currentRoomName)
      
      // 向当前房间广播用户退出信息
      socket.broadcast.to(chatData.currentRoomName).emit('user logout req', {
        currentUser: loginedUserName,
        currentUserList: chatData.room[chatData.currentRoomIndex].user,
        currentUserListImg: chatData.room[chatData.currentRoomIndex].img
      })
      console.log('disconnect / getCurrentRoomID / ' + chatData.currentRoomName)
      console.log('disconnect / getCurrentRoomIndex / ' + chatData.currentRoomIndex)
      console.log('disconnect / getCurrentUser  / ' + loginedUserName)
    });
  })
  server.listen(port)
  console.log(`socket-server on ${port}`)
}
module.exports = event