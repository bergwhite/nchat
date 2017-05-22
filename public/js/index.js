var pathName = document.location.pathname
var isHome = pathName === '/'
var roomId = null
if (!isHome && (pathName.indexOf('room') !== -1)) {
  roomId = pathName.replace(/\/.*?\//,'')
}
roomId === null ? roomId = '@main@' : ''
console.log('roomId: ' + roomId)
var currentUser = null
var newUser = document.getElementById('newUser')
var tip = document.getElementById('tip')
var chatLists = document.getElementsByClassName('chat-lists')[0]
var chatSendCtx = document.getElementsByClassName('chat-send-ctx')[0]
var chatShowCtx = document.getElementsByClassName('chat-show-ctx')[0]
function sendMessage () {
  socket.emit('sendMessage', roomId , {user: currentUser !== null ? currentUser : '神秘人', msg: chatSendCtx.innerHTML})
  appendElement(chatShowCtx, 'li', (currentUser !== null ? currentUser : '神秘人') + ':' + chatSendCtx.innerHTML)
}
function renderUserList (arr) {
  for(var i = 0; i < arr.length; i++){
    appendElement(chatLists, 'li', arr[i])
  }
}
function initDOMFragement (type) {
  type['innerHTML'] = ''
}
function appendElement (parentDOM, childType, childCtx) {
  var childDOM = document.createElement(childType)
  childDOM.innerHTML = childCtx
  parentDOM.appendChild(childDOM)
}
var socket = io('http://localhost:81/')
socket.on('request room id', function () {
  socket.emit('response room id', roomId)
})
socket.on('init the room', function (data) {
  appendElement(chatShowCtx, 'li', data.user + ':' + decodeURIComponent(data.msg))
})
socket.on('latestTalk', function (data) {
  appendElement(chatShowCtx, 'li', data.user + ':' + data.msg)
  console.log(data)
})
socket.on('welcome', function  (data) {
  initDOMFragement(chatLists)
  renderUserList(data.userList)
  console.log(data)
  console.log("当前在线：" + data.userList.length)
})
socket.on('renderOnlineList', function (data) {
  appendElement(chatLists, 'li', data)
})
socket.on('showUser', function  (data) {
  if (!data.status) {
    tip.innerHTML = '用户名已存在'
    currentUser = null
  } else {
    tip.innerHTML = '注册成功'
    renderUserList([data.userList[data.userList.length -1 ]])
  }
  console.log(data)
  console.log("当前在线：" + data.userList.length)
  console.log("注册状态：" + data.status)
})
function reg () {
  if (currentUser) {
    tip.innerHTML = '已登陆，用户名为：' + currentUser
  }else if (newUser.value !== "" && newUser.value !== " ") { 
    currentUser = newUser.value
    socket.emit('user', {newUserName: newUser.value})
  } else {
    tip.innerHTML = '请输入用户名'
  }
}
document.body.onload = function () {
  chatSendCtx.focus()
}