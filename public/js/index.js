var userReg = document.getElementById('user-reg')
var userRegTip = document.getElementById('user-reg-tip')
var chatMsgSend = document.getElementsByClassName('chat-msg-send')[0]
var infoTab = document.getElementsByClassName('info-tab')[0]
var chatMsgList = document.getElementsByClassName('chat-msg-list')[0]
var userList = document.getElementsByClassName('user-lists')[0]
var roomList = document.getElementsByClassName('room-list')[0]
var chatMoreBox = document.getElementsByClassName('chat-more-box')[0]

// 为socket.io设置别名
var socketHostName = document.location.hostname
var socketURI = 'http://' +  socketHostName + ':8089/'
var socket = io(socketURI)

// 把聊天室所有的操作封装在命名空间内
var nodejsChat = {}

// 数据（存放变量）
nodejsChat.data = {
  isRoomInit: false,
  messIsFirst: true,
  messIsFoucs: false,
  isInitInsertEmoji: false,
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
      // 每次进来，先清空房间列表
      roomList.innerHTML = ''
      // 把当前房间id返回给后台
      socket.emit('response room id', nodejsChat.data.roomID)
      // 为当前房间发送欢迎消息
      nodejsChat.method.insertToList(chatMsgList, 'li', nodejsChat.data.welcomeInfo + nodejsChat.data.roomID)
      // 初始化输入框内容为空
      chatMsgSend.value = ''
      // 初始化表情框为不可见
      chatMoreBox.style.visibility = 'hidden'
      // 监听输入框点击事件
      chatMsgSend.onclick = function () {
        // 隐藏表情框
        chatMoreBox.style.visibility = 'hidden'
        nodejsChat.data.messIsFoucs = true
      }
    })
    socket.on('showRoom', function  (data) {
      nodejsChat.method.insertToList(roomList, 'li', data)
    })
    socket.on('welcome the user', function (data) {
      nodejsChat.method.insertToList(chatMsgList, 'li', data)
    })
    socket.on('request user logout', function (data) {
      console.log(data)
      // 发送用户离开通知
      nodejsChat.method.insertToList(chatMsgList, 'li', data.currentUser + ' 离开了房间')
      // 滚动到最新消息
      nodejsChat.method.toBottom()
      // 清空在线列表
      nodejsChat.method.initList(userList)
      // 重新渲染在线列表
      nodejsChat.method.renderList('user', data.currentUserList)
    })
    socket.on('show latest talk', function (data) {
      console.log(data)
      var len = data.length
      for(var i = 0; i < len; i++){
        var leftBubble = nodejsChat.method.renderBubbleMsg('left', data[i].user, nodejsChat.method.parseTime(data[i].time), nodejsChat.method.parseMsgVal(data[i].mess))
        nodejsChat.method.insertToList(chatMsgList, 'li', leftBubble)
      }
      nodejsChat.method.toBottom()
    })
  },
  // 渲染
  render: function () {
    // 进入页面打印当前聊天室状态
    socket.on('current status', function  (data) {
      nodejsChat.method.initList(userList)
      nodejsChat.method.getOnlineList(data.room, nodejsChat.data.roomID)
      nodejsChat.method.renderList('user', nodejsChat.data.onlineUserList)
      nodejsChat.method.renderList('room', data.roomList)
      console.log(data)
      console.log("在线统计：" + nodejsChat.data.onlineUserCount)
      console.log('在线用户：' + nodejsChat.data.onlineUserList)
    })
    // 渲染在线用户列表
    socket.on('renderOnlineList', function (data) {
      nodejsChat.method.insertToList(userList, 'li', data)
    })
    // 把最新的消息添加进DOM
    socket.on('latestTalk', function (data) {
      var time = nodejsChat.method.parseTime(data.time)
      var leftBubble = nodejsChat.method.renderBubbleMsg('left', data.user, time, nodejsChat.method.parseMsgVal(data.msg))
      nodejsChat.method.insertToList(chatMsgList, 'li', leftBubble)
      console.log(data)
      // 滚动到最新消息
      nodejsChat.method.toBottom()
    })
    //
    socket.on('showUser', function  (data) {
      if (!data.status) {
        userRegTip.innerHTML = '用户名已存在'
        nodejsChat.data.user.name = null
      } else {
        // userReg.value = '输入密码可以完成注册'
        userRegTip.innerHTML = '注册成功'
        // 聚焦到输入框
        chatMsgSend.focus()
        nodejsChat.method.renderList('user', [data.user])
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
  // 清空节点内容
  initList: function (node) {
    node['innerHTML'] = ''
  },
  // 渲染列表
  renderList: function (parentNode, childArr, template) {
    // 设置父节点别名
    var type = {
      room: roomList,
      user: userList,
      chat: chatMsgList,
      emoji: chatMoreBox
    }
    // 逐个渲染
    for(var i = 0; i < childArr.length; i++){
      this.insertToList(type[parentNode], 'li', childArr[i])
    }
  },
  // 插入值到节点
  insertToList: function (parentDOM, childType, childCtx) {
    var childDOM = document.createElement(childType)
    childDOM.innerHTML = childCtx
    parentDOM.appendChild(childDOM)
  },
  // 左右泡泡组件模板
  renderBubbleMsg: function (type, user, time,  msg) {
    var ctx = `<div class="bubble bubble-${type}">
      <div class="bubble-head">
        头像
      </div>
      <div class="bubble-ctx">
        <ul class="bubble-info">
          <li class="bubble-info-user">${user}</li>
          <li class="bubble-info-time">${time}</li>
        </ul>
        <div class="bubble-ctx-border">
          <p class="bubble-ctx-show">${msg}</p>
        </div>
      </div>
    </div>`
    return ctx
  },
  parseMsgVal: function (v) {
    var val = v.replace(/</g,'&lt;')
    val = val.replace(/>/g,'&gt;')
    return val
  },
  // 获取时间戳
  getTime: function (t) {
    return Date.parse(t) / 1000
  },
  // 解析时间戳
  parseTime: function (t) {
    var tm = new Date()
    tm.setTime(t * 1000)
    return tm.toLocaleString()
  },
  // 发送消息
  sendMessage: function () {
    if (chatMsgSend.value !== '') {
      // 隐藏表情框
      chatMoreBox.style.visibility = 'hidden'
      // 获取当前时间戳
      var time = nodejsChat.method.getTime(new Date())
      var timeShow = nodejsChat.method.parseTime(time)
      var name = nodejsChat.data.user.name !== null ? nodejsChat.data.user.name : '神秘人'
      var rightBubble = nodejsChat.method.renderBubbleMsg('right', name, timeShow,  nodejsChat.method.parseMsgVal(chatMsgSend.value))
      socket.emit('send message', time, nodejsChat.data.roomID , {user: name,time: time, msg: nodejsChat.method.parseMsgVal(chatMsgSend.value)})
      nodejsChat.method.insertToList(chatMsgList, 'li', rightBubble)
      // 发送完消息清空内容
      chatMsgSend.value = ''
      // 发送完消息重新把焦点放置在输入框
      chatMsgSend.focus()
      // 滚动到最新消息
      nodejsChat.method.toBottom()
    } else {
      userRegTip.innerHTML = '内容不能为空'
    }
  },
  // 注册用户
  regUser: function () {
    if (nodejsChat.data.user.name) {
      userRegTip.innerHTML = '已登陆，用户名为：' + nodejsChat.data.user.name
    }else if (userReg.value !== "" && userReg.value !== " ") { 
      userRegTip.innerHTML = '注册中...'
      nodejsChat.data.user.name = nodejsChat.method.parseMsgVal(userReg.value)
      socket.emit('add user', nodejsChat.data.roomID, {name: nodejsChat.method.parseMsgVal(userReg.value)})
    } else {
      userRegTip.innerHTML = '请输入用户名'
    }
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
  // 获取随机图片
  getRandomImg: function (gender) {
    // example / https://randomuser.me/api/portraits/men/100.jpg
    var randomNumber = parseInt(Math.random() * 100)
    return 'https://randomuser.me/api/portraits/' + gender + '/' + randomNumber + '.jpg'
  },
  // 获取随机昵称
  getRandomNick: function (region,gender) {
    // example / https://uinames.com/api/?region=china&gender=female&amount=1
    return 'https://uinames.com/api/?region=' + region + '&gender=' + gender + '&amount=1'
  },
  // 通过选项标签改变显示的内容
  setInfoTabMargin: function (type) {
    infoTab.style.marginLeft = - (type - 1 ) * 181 + 'px'
  },
  // 渲染表情包
  getEmoji: function (node) {
    var emojiList = ['😅', '😂', '🙂', '🙃', '😉', '😘', '😗', '😜', '😎', '😏', '😔', '🙁', '😶', '😢', '🤔', '👏', '🤝', '👍', '👎', '✌', '❤', '🐶', '🐱', '🐰', '🐭', '🐷', '🐸', '🙈',]
    var nodeName = node || chatMoreBox
    this.initList(nodeName)
    nodeName.style.visibility === 'hidden' ? chatMoreBox.style.visibility = 'visible' : chatMoreBox.style.visibility = 'hidden'
    this.renderList('emoji', emojiList)
    // 只初始化一次事件监听
    nodejsChat.data.isInitInsertEmoji === false ? this.initInsertEmoji() : ''
  },
  // 用事件代理监听所有的标签添加事件
  initInsertEmoji: function () {
    chatMoreBox.addEventListener('click', function (e) {
      // 如果当前值的目标标签的小写字母是select
      if (e.target.tagName.toLowerCase() === 'li') {
        // 则显示监听到的值
        nodejsChat.method.insertEmoji(e.target.innerText)
      }
    },false)
    // 设置事件监听初始化状态为真
    nodejsChat.data.isInitInsertEmoji = true
  },
  // 插入表情包
  insertEmoji: function (type) {
    var messVal = chatMsgSend.value  // 表单值
    var index = chatMsgSend.selectionStart  // 光标位置
    // 如果当前为第一次并且没有点击过输入框
    // 则把索引改为最后
    nodejsChat.data.messIsFirst && (!nodejsChat.data.messIsFoucs) ? index = messVal.length : ''
    // 执行完第一次则把是否是第一次的状态改为false
    nodejsChat.data.messIsFirst = false
    // 首部插入
    if (messVal === '') {
      chatMsgSend.value = type
    }
    // 尾部插入
    else if (messVal.length === index) {
      chatMsgSend.value = chatMsgSend.value + type
    }
    // 中间插入
    else {
      chatMsgSend.value = messVal.slice(0,index) + type + messVal.slice(index,messVal.length)
    }
    chatMsgSend.focus()
    console.log('currentFoucsIndex: ' + index)
    console.log(messVal.length)
  },
  // 滚动到最新消息
  toBottom: function () {
    var div = document.getElementsByClassName("chat-ctx")[0];
    div.scrollTop = div.scrollHeight;
  }
}

document.body.onload = function () {
  // 文档加载完毕自动在输入框获得焦点
  userReg.focus()
  // 初始化房间ID
  nodejsChat.data.roomID = nodejsChat.method.getRoomID()
  // 初始化
  // 为当前房间分配ID
  nodejsChat.room.init()
  // 渲染
  nodejsChat.room.render()
  // 测试随机图片
  console.log(nodejsChat.method.getRandomImg('men'))
  // 测试随机昵称
  console.log(nodejsChat.method.getRandomNick('china','male'))
}
