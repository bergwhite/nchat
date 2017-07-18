(function(){
  const chatMsgSend = document.getElementsByClassName('chat-msg-send')[0]
  const chatMsgSendBtn = document.getElementsByClassName('chat-send-btn')[0]
  const chatEmojiList = document.getElementsByClassName('chat-emoji-list')[0]
  const infoTab = document.getElementsByClassName('info-tab')[0]
  const chatMsgList = document.getElementsByClassName('chat-msg-list')[0]
  const chatMoreBox = document.getElementsByClassName('chat-more-box')[0]
  const topTitleDOM = document.getElementsByClassName('top-title')[0]
  const chatDOM = document.getElementsByClassName('chat-ctx')[0]
  const chatCtrl = document.getElementsByClassName('chat-ctrl')[0]

  // 为socket.io设置别名
  const socketHostName = document.location.hostname
  const socketURI = `http://${socketHostName}:8087/`
  const socket = io(socketURI)

  // 把聊天室所有的操作封装在命名空间内
  const nChat = {}

  // 数据（存放变量）
  nChat.data = {
    // TODO: set a default img
    isRoomInit: false,
    messIsFirst: true,
    messIsFoucs: false,
    isInitInsertEmoji: false,
    onlineUserCount: 0,
    onlineUserList: [],
    onlineUserListImg: [],
    defaultUserImg: 'https://randomuser.me/api/portraits/women/50.jpg',
    welcomeInfo: '系统: 欢迎来到 ',
    // 房间ID
    currentRoomName: null,
    // 用户资料
    user: {
      name: null,
      pass: null,
      desc: null,
      img: 'https://randomuser.me/api/portraits/men/1.jpg',
      sex: 'men'
    },
    robot: {
      api: `${document.location.origin}/api/robot/openapi/api`,
      key: '57a5b6849e2b4d47ae0badadf849c261',
      nick: '小美',
      img: 'https://randomuser.me/api/portraits/women/60.jpg'
    }
  }
  // 房间（socket通讯）
  nChat.room = {
    // 初始化
    init () {
      socket.on('room id req', (msg) => {
        nChat.data.user.name = msg.name
        nChat.data.user.img = msg.img
        // 把当前房间id返回给后台
        socket.emit('room id res', nChat.data.currentRoomName)
        // 为当前房间发送欢迎消息
        nChat.method.insertToList(chatMsgList, 'li', `${nChat.data.welcomeInfo} ${nChat.data.currentRoomName}`)
        // 初始化输入框内容为空
        chatMsgSend.value = ''
        chatMsgSend.focus()
        // 初始化表情框为不可见
        chatMoreBox.style.visibility = 'hidden'
        // 监听输入框点击事件
        chatMsgSend.onclick = () => {
          // 隐藏表情框
          chatMoreBox.style.visibility = 'hidden'
          nChat.data.messIsFoucs = true
        }
      })

      socket.on('user login req', (data) => {
        nChat.method.insertToList(chatMsgList, 'li', data)
      })
      socket.on('user logout req', (data) => {
        console.log(data)
        // 发送用户离开通知
        nChat.method.insertToList(chatMsgList, 'li', `${data.currentUser} 离开了房间`)
        // 滚动到最新消息
        nChat.method.scrollToBottom()
      })
      // 读取当前房间的聊天信息
      socket.on('mess show res', (data) => {
        console.log(data)
        const len = data.length
        for(let i = 0; i < len; i++){
          const leftBubble = nChat.method.renderBubbleMsg('left', data[i].user, nChat.method.parseTime(data[i].time), nChat.method.parseMsgVal(data[i].mess), data[i].img)
          nChat.method.insertToList(chatMsgList, 'li', leftBubble)
        }
        nChat.method.scrollToBottom()
      })
    },
    // 渲染
    render () {
      socket.on('current status', (data) => {
        console.log(data)
      })
      // 把最新的消息添加进DOM
      socket.on('send message res', (data) => {
        const time = nChat.method.parseTime(data.time)
        const leftBubble = nChat.method.renderBubbleMsg('left', data.user, time, nChat.method.parseMsgVal(data.msg), data.img)
        nChat.method.insertToList(chatMsgList, 'li', leftBubble)
        const len = data.length
        console.log(`total message / ${len}`)
        // 滚动到最新消息
        nChat.method.scrollToBottom()
      })
    }
  }
  // 方法（存放函数）
  nChat.method = {
    // 获取房间ID
    getCurrentRoomName () {
      const pathName = document.location.pathname
      const isHome = pathName === '/'
      let roomId = null
      if (!isHome && (pathName.indexOf('room') !== -1)) {
        roomId = pathName.replace(/\/.*?\//,'')
      }
      return roomId === null ? roomId = 'Chat Room' : decodeURIComponent(roomId)
    },
    // 清空节点内容
    initList (node) {
      node['innerHTML'] = ''
    },
    // 渲染列表
    renderList (parentNode, childArr, template) {
      // 设置父节点别名
      const type = {
        chat: chatMsgList,
        emoji: chatMoreBox
      }
      // 逐个渲染
      for(let i = 0; i < childArr.length; i++){
        this.insertToList(type[parentNode], 'li', childArr[i])
      }
    },
    // 插入值到节点
    insertToList (parentDOM, childType, childCtx) {
      const childDOM = document.createElement(childType)
      childDOM.innerHTML = childCtx
      parentDOM.appendChild(childDOM)
    },
    renderUserList (userImg, userName) {
      const ctx = `<img src="${userImg}" class="user-img">
        <span class="user-name">${userName}</span>`
      return ctx
    },
    // 左右泡泡组件模板
    renderBubbleMsg (type, user, time, msg, img) {
      let bubbleInfoEl = ''
      if (time !== '') {
        bubbleInfoEl = `
          <ul class="bubble-info">
            <li class="bubble-info-user">${user}</li>
            <li class="bubble-info-time">${time}</li>
          </ul>`
      }
      else {
        bubbleInfoEl = ''
      }
      if (typeof img === 'undefined' || img === null) {
         img = nChat.data.defaultUserImg
      }
      const ctx = `<div class="bubble bubble-${type}">
        <div class="bubble-head">
          <img src=${img} class="user-img">
        </div>
        <div class="bubble-ctx">
          ${bubbleInfoEl}
          <div class="bubble-ctx-border">
            <p class="bubble-ctx-show">${msg}</p>
          </div>
        </div>
      </div>`
      return ctx
    },
    parseMsgVal (v) {
      let val = v.replace(/</g,'&lt;')
      val = val.replace(/>/g,'&gt;')
      return val
    },
    // 获取时间戳
    getTime (t) {
      return Date.parse(t) / 1000
    },
    // 解析时间戳
    parseTime (t) {
      const tm = new Date()
      tm.setTime(t * 1000)
      return tm.toLocaleString()
    },
    // 发送消息
    sendMessage () {
      if (chatMsgSend.value !== '') {
        // 隐藏表情框
        chatMoreBox.style.visibility = 'hidden'
        // 获取当前时间戳
        const time = nChat.method.getTime(new Date())
        // const timeShow = nChat.method.parseTime(time)
        const name = nChat.data.user.name !== null ? nChat.data.user.name : '神秘人'
        const parsedMessage = nChat.method.parseMsgVal(chatMsgSend.value)
        // 添加内容到当前界面
        const rightBubble = nChat.method.renderBubbleMsg('right', name, '',  parsedMessage, nChat.data.user.img)
        // 添加内容到当前房间的其他用户界面
        socket.emit('send message req', time, nChat.data.currentRoomName , {time: time, msg: parsedMessage})
        nChat.method.insertToList(chatMsgList, 'li', rightBubble)
        // 发送完消息清空内容
        chatMsgSend.value = ''
        // 发送完消息重新把焦点放置在输入框
        chatMsgSend.focus()
        // 滚动到最新消息
        nChat.method.scrollToBottom()
        if (nChat.data.currentRoomName === '小美') {
          // 调用图灵机器人
          // TODO: post not work
          axios.get(nChat.data.robot.api, {
            params: {
              key: nChat.data.robot.key,
              info: parsedMessage
            }
          }).then((res) => {
            const tm = nChat.method.getTime(new Date())
            const leftBubble = nChat.method.renderBubbleMsg('left', nChat.data.robot.nick, tm,  res.data.text, nChat.data.robot.img)
            nChat.method.insertToList(chatMsgList, 'li', leftBubble)
            socket.emit('send message req', time, nChat.data.currentRoomName , {user: nChat.data.robot.nick,tm: time, msg: res.data.text, img: nChat.data.robot.img})
            nChat.method.scrollToBottom()
          }).catch((err) => console.log(err))
        }
      }
    },
    // 获取在线列表
    getOnlineList (arr, type) {
      arr.filter((val) => {
        if (val.name === type) {
          const newArr = val.user.concat()
          const newImg = val.img.concat()
          nChat.data.onlineUserCount = val.user.length
          nChat.data.onlineUserList = newArr
          nChat.data.onlineUserListImg = newImg
        }
      })
    },
    // 获取随机图片
    getRandomImg (gender) {
      // example / https://randomuser.me/api/portraits/men/100.jpg
      const randomNumber = parseInt(Math.random() * 100)
      return `https://randomuser.me/api/portraits/${gender}/${randomNumber}.jpg`
    },
    // 获取随机昵称
    getRandomNick (region,gender) {
      // example / https://uinames.com/api/?region=china&gender=female&amount=1
      return `https://uinames.com/api/?region=${region}&gender=${gender}&amount=1`
    },
    // 渲染表情包
    getEmoji (node) {
      const emojiList = ['😅', '😂', '🙂', '🙃', '😉', '😘', '😗', '😜', '😎', '😏', '😔', '🙁', '😶', '😢', '🤔', '👏', '🤝', '👍', '👎', '✌', '❤', '🐶', '🐱', '🐰', '🐭', '🐷', '🐸', '🙈',]
      const nodeName = node || chatMoreBox
      this.initList(nodeName)
      nodeName.style.visibility === 'hidden' ? chatMoreBox.style.visibility = 'visible' : chatMoreBox.style.visibility = 'hidden'
      this.renderList('emoji', emojiList)
      // 只初始化一次事件监听
      nChat.data.isInitInsertEmoji === false ? this.initInsertEmoji() : ''
    },
    // 用事件代理监听所有的标签添加事件
    initInsertEmoji () {
      chatMoreBox.addEventListener('click', (e) => {
        // 如果当前值的目标标签的小写字母是select
        if (e.target.tagName.toLowerCase() === 'li') {
          // 则显示监听到的值
          nChat.method.insertEmojiToText(e.target.innerText)
        }
      },false)
      // 设置事件监听初始化状态为真
      nChat.data.isInitInsertEmoji = true
    },
    // 插入表情包
    insertEmojiToText (type) {
      const messVal = chatMsgSend.value  // 表单值
      let index = chatMsgSend.selectionStart  // 光标位置
      // 如果当前为第一次并且没有点击过输入框
      // 则把索引改为最后
      nChat.data.messIsFirst && (!nChat.data.messIsFoucs) ? index = messVal.length : ''
      // 执行完第一次则把是否是第一次的状态改为false
      nChat.data.messIsFirst = false
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
    },
    // 滚动到最新消息
    scrollToBottom () {
      const div = document.getElementsByClassName("chat-ctx")[0];
      div.scrollTop = div.scrollHeight;
    }
  }

  // 通过计算获取聊天框的合适高度
  function changeChatHeight() {
    const documentHeight = document.documentElement.clientHeight
    const topTitleDOMHeight = topTitleDOM.offsetHeight
    const chatCtrlHeight = chatCtrl.offsetHeight
    const chatDOMHeight = documentHeight - topTitleDOMHeight - chatCtrlHeight
    chatDOM.style.height = `${chatDOMHeight}px`
  }

  // 视窗改变时重新计算高度
  window.onresize = () => changeChatHeight()

  document.body.onload = () => {

    // 页面加载完成后改变高度
    changeChatHeight()

    // 页面加载完成后，初始化房间名字
    // 发送消息的时候会把当前房间的名字发送过去
    nChat.data.currentRoomName = nChat.method.getCurrentRoomName()
    // 初始化
    // 为当前房间分配ID
    nChat.room.init()
    // 渲染
    nChat.room.render()
    // 测试随机图片
    console.log(nChat.method.getRandomImg('men'))
    // 测试随机昵称
    console.log(nChat.method.getRandomNick('china','male'))
    chatMsgSendBtn.addEventListener('click',() => nChat.method.sendMessage(), false)
    chatEmojiList.addEventListener('click', () => nChat.method.getEmoji(), false)
  }
})();
