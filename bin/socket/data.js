const data = {
  // 所有在线用户
  user: [],
  // 所有聊天室
  room: [{
    // 名字
    name: 'Chat Room',
    // 描述
    desc: null,
    // 用户
    user: [],
    img: []
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

module.exports = data