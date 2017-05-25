var userList = document.getElementsByClassName('user-lists')[0]
var userReg = document.getElementById('user-reg')
var userRegTip = document.getElementById('user-reg-tip')
var chatMsgList = document.getElementsByClassName('chat-msg-list')[0]
var chatMsgSend = document.getElementsByClassName('chat-msg-send')[0]
var infoTab = document.getElementsByClassName('info-tab')[0]
var roomList = document.getElementsByClassName('room-list')[0]

// 文档加载完毕自动在输入框获得焦点
document.body.onload = function () {
  chatMsgSend.focus()
}

// 为socket.io设置别名
var socket = io('http://localhost:8089/')

// 把聊天室所有的操作封装在命名空间内
var nodejsChat = {}

// 数据（存放变量）
nodejsChat.data = {
  isRoomInit: false,
  onlineUserCount: 0,
  onlineUserList: [],
  welcomeInfo: '系统: 欢迎来到 ',
  // 房间ID
  roomID: null,
  // 用户资料
  user: {
    name: null,
    pass: null,
    desc: null,
    img: null
  }
}
// 房间（socket通讯）
nodejsChat.room = {
  // 初始化
  init: function () {
    socket.on('request room id', function () {
      // 把当前房间id返回给后台
      socket.emit('response room id', nodejsChat.data.roomID)
      // 为当前房间发送欢迎消息
      nodejsChat.method.appendElement(chatMsgList, 'li', nodejsChat.data.welcomeInfo + nodejsChat.data.roomID)
      // 初始化输入框内容为空
      chatMsgSend.innerHTML = ''
    })
    socket.on('welcome the user', function (data) {
      nodejsChat.method.appendElement(chatMsgList, 'li', data)
    })
  },
  // 渲染
  render: function () {
    // 进入页面打印当前聊天室状态
    socket.on('current status', function  (data) {
      nodejsChat.method.initDOMFragement(userList)
      nodejsChat.method.getOnlineList(data.room, nodejsChat.data.roomID)
      nodejsChat.method.renderUserList(nodejsChat.data.onlineUserList)
      nodejsChat.method.renderRoomList(data.room)
      console.log(data.room)
      console.log(data)
      console.log("在线统计：" + nodejsChat.data.onlineUserCount)
      console.log('在线用户：' + nodejsChat.data.onlineUserList)
    })
    // 渲染在线用户列表
    socket.on('renderOnlineList', function (data) {
      nodejsChat.method.appendElement(userList, 'li', data)
    })
    // 把最新的消息添加进DOM
    socket.on('latestTalk', function (data) {
      nodejsChat.method.appendElement(chatMsgList, 'li', data.user + ': ' + data.msg)
      console.log(data)
    })
    //
    socket.on('showUser', function  (data) {
      if (!data.addUserStatus) {
        userRegTip.innerHTML = '用户名已存在'
        nodejsChat.data.user.name = null
      } else {
        userRegTip.innerHTML = '注册成功'
        nodejsChat.method.renderUserList([data.user[data.user.length - 1]])
      }
      console.log(data)
      console.log("当前在线：" + data.user.length)
      console.log("注册状态：" + data.status)
    })
  }
}
// 方法（存放函数）
nodejsChat.method = {
  // 获取房间ID
  getRoomID: function () {
    var pathName = document.location.pathname
    var isHome = pathName === '/'
    var roomId = null
    if (!isHome && (pathName.indexOf('room') !== -1)) {
      roomId = pathName.replace(/\/.*?\//,'')
    }
    return roomId === null ? roomId = 'Chat Room' : decodeURIComponent(roomId)
  },
  // 渲染用户列表
  renderUserList: function (arr) {
    for(var i = 0; i < arr.length; i++){
      console.log('renderUserList：' + arr[i])
      this.appendElement(userList, 'li', arr[i])
    }
  },
  renderRoomList: function (arr) {
    for(var i = 0; i < arr.length; i++){
      console.log('renderRoomList：' + arr[i].name)
      this.appendElement(roomList, 'li', arr[i].name)
    }
  },
  // 发送消息
  sendMessage: function () {
    if (chatMsgSend.inneHTML !== '') {
      socket.emit('send message', nodejsChat.data.roomID , {user: nodejsChat.data.user.name !== null ? nodejsChat.data.user.name : '神秘人', msg: chatMsgSend.innerHTML})
      nodejsChat.method.appendElement(chatMsgList, 'li', (nodejsChat.data.user.name !== null ? nodejsChat.data.user.name : '神秘人') + ': ' + chatMsgSend.innerHTML)
      // 发送完消息清空内容
      chatMsgSend.innerHTML = ''
      // 发送完消息重新把焦点放置在输入框
      chatMsgSend.focus()
    } else {
      chatMsgSend.innerHTML = '内容不能为空'
    }
  },
  // 注册用户
  regUser: function () {
    if (nodejsChat.data.user.name) {
      userRegTip.innerHTML = '已登陆，用户名为：' + nodejsChat.data.user.name
    }else if (userReg.value !== "" && userReg.value !== " ") { 
      nodejsChat.data.user.name = userReg.value
      socket.emit('add user', nodejsChat.data.roomID, {name: userReg.value})
    } else {
      userRegTip.innerHTML = '请输入用户名'
    }
  },
  // 清空节点内容
  initDOMFragement: function (type) {
    type['innerHTML'] = ''
  },
  // 在节点下添加子节点
  appendElement: function (parentDOM, childType, childCtx) {
    var childDOM = document.createElement(childType)
    childDOM.innerHTML = childCtx
    parentDOM.appendChild(childDOM)
  },
  // 获取在线列表
  getOnlineList: function (arr, type) {
    arr.filter(function (val) {
      if (val.name === type) {
        var newArr = val.user.concat()
        nodejsChat.data.onlineUserCount = val.user.length
        nodejsChat.data.onlineUserList = newArr
      }
    })
  },
  getRandomImg: function (gender) {
    // example / https://randomuser.me/api/portraits/men/100.jpg
    var randomNumber = parseInt(Math.random() * 100)
    return 'https://randomuser.me/api/portraits/' + gender + '/' + randomNumber + '.jpg'
  },
  getRandomNick: function (region,gender) {
    // example / https://uinames.com/api/?region=china&gender=female&amount=1
    return 'https://uinames.com/api/?region=' + region + '&gender=' + gender + '&amount=1'
  },
  setInfoTabMargin: function (type) {
    infoTab.style.marginLeft = - (type - 1 ) * 181 + 'px'
  }
}

// 初始化房间ID
nodejsChat.data.roomID = nodejsChat.method.getRoomID()

// 初始化
// 为当前房间分配ID
nodejsChat.room.init()
// 渲染
nodejsChat.room.render()
console.log(nodejsChat.method.getRandomImg('men'))
console.log(nodejsChat.method.getRandomNick('china','male'))
