const roomMember = document.getElementsByClassName('room-member-list-wrap')[0]
const currentUrlOrigin = document.location.origin
const socketScriptTag = document.createElement('script')
const socketScriptSrc = `//${document.location.hostname}:9998/socket.io/socket.io.js`
socketScriptTag.src = socketScriptSrc
document.head.appendChild(socketScriptTag)

socketScriptTag.onload = () => {
  const socketHostName = document.location.hostname
  const socketURI = `//${socketHostName}:9998/`
  const socket = io(socketURI)
  // 发送更新求
  socket.emit('user list req')
  // 更新在线列表
  socket.on('user list res', (v) => {
    // 每次更新前后清空内容
    roomMember.innerHTML = ''
    renderRoomMemberDOM(v)
    console.log(v)
  })
}

function insertToRoomMemberDOM({img, name}){
  const roomMemberTemplate = `
    <li>
      <a class="room-member-list animated fadeIn" href="${currentUrlOrigin}/user/${name}">
        <div class="room-member-info">
          <img class="room-member-img" src="${img}">
          <span class="room-member-name">${name}</span>
        </div>
      </a>
    </li>
  `
  roomMember.innerHTML += roomMemberTemplate
}

function renderRoomMemberDOM(v){
  v.map((e, i)=>setTimeout(() => insertToRoomMemberDOM(e),200 * i))
}
