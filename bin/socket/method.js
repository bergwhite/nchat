const io = require('./io.js').io
const chatData = require('./data')
const method = {
  // 初始化房间索引
  getCurrentRoomIndex: function (roomID) {
    return chatData.room.findIndex(function(val,index){
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
  addUserToRoom: function (name, roomID, userImg) {
    chatData.room.findIndex(function(val,index){
      if(val.name === roomID) {
        if(chatData.room[index].user.indexOf('name') === -1) {
          chatData.room[index].user.push(name)
          chatData.room[index].img.push(userImg)
          chatData.addUserStatus = true
        }
        else {
          chatData.addUserStatus = false
        }
      }
    })
  },
  // 删除指定房间用户
  delUserFromRoom: function (user, roomIndex) {
    var userIndex = chatData.room[roomIndex].user.indexOf(user)
    // 从房间中移除
    chatData.room[roomIndex].user.splice(userIndex, 1)
    chatData.room[roomIndex].img.splice(userIndex, 1)
  },
  welcomeUser: function (roomID, msg) {
    // 为当前房间发送欢迎消息
    io.to(roomID).emit('user login req', msg);
  }
}

module.exports = method