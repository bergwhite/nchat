const roomMember = document.getElementsByClassName('room-member-list-wrap')[0]
const currentUrlOrigin = document.location.origin
const socketScriptTag = document.createElement('script')
const socketScriptSrc = `http://${document.location.hostname}:8087/socket.io/socket.io.js`
socketScriptTag.src = socketScriptSrc
document.head.appendChild(socketScriptTag)

socketScriptTag.onload = () => {
  const socketHostName = document.location.hostname
  const socketURI = `http://${socketHostName}:8087/`
  const socket = io(socketURI)
  socket.on('user list res', (v) => {
    renderRoomMemberDOM(v)
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