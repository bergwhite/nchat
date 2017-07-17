const io = require('./io.js').io
const chatData = require('./data')
const method = {

  // 判断房间是否存在
  isRoomExistReally (roomName) {
    if (typeof chatData.roomTest[roomName] !== 'undefined') {
      return true
    }
    return false
  },

  // 判断用户在指定房间的索引
  getUserIndexOfRoom (roomName, userName) {
    return chatData.roomTest[roomName].findIndex((e)=>e.name === userName)
  },

  // 添加房间
  setRoomList (roomName) {
    chatData.roomTest[roomName] = []
  },

  // 获取房间列表
  getRoomList () {
    return Object.keys(chatData.roomTest)
  },

  // 添加用户到指定房间
  addUserToTheRoom (roomName, userInfo) {
    if (!this.isRoomExistReally(roomName)) {
      this.setRoomList(roomName)
    }
    if (this.getUserIndexOfRoom(roomName, userInfo.name) === -1) {  
      chatData.roomTest[roomName].push(userInfo)
    }
  },

  // 从指定房间删除用户
  delUserFromTheRoom (roomName, userName) {
    const userIndex = this.getUserIndexOfRoom(roomName, userName)
    if( userIndex !== -1) {
      chatData.roomTest[roomName].splice(userIndex ,1)
    }
  },

  // 获取某个房间所有用户
  getAllUsersFromOneRoom (roomName) {
    if (this.isRoomExistReally(roomName)) {
      return Object.keys(chatData.roomTest)
    }
    return []
  },

  // 初始化房间索引
  getCurrentRoomIndex (roomID) {
    return chatData.room.findIndex((val,index) => {
      console.log('name: ' + val.name)
      console.log('roomID: ' + roomID)
      return val.name === roomID
    })
  },

  // 获取当前房间ID
  getCurrentRoomID (socket) {
    const URI = socket.request.headers.referer
    const decodeURI = URI.match(/room\/(.*)?/)
    return decodeURI === null ? 'Chat Room' : decodeURIComponent(decodeURI[1].replace('/',''))
  },

  // 判断当前房间是否存在
  isRoomExist (arr, roomID) {
    const a = arr.filter((val) => {
      if(val.name === roomID) {
        return true
      }
    })
    return a.length !== 0
  },

  // 添加用户到指定房间
  addUserToRoom (name, roomID, userImg) {
    chatData.room.findIndex((val,index) => {
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
  delUserFromRoom (user, roomIndex) {
    const userIndex = chatData.room[roomIndex].user.indexOf(user)
    chatData.room[roomIndex].user.splice(userIndex, 1)
    chatData.room[roomIndex].img.splice(userIndex, 1)
  },

  // 向指定房间
  welcomeUser (roomID, msg) {
    io.to(roomID).emit('user login req', msg);
  }
}

module.exports = method