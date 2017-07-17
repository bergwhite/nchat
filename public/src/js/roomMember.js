const socketScriptTag = document.createElement('script')
const socketScriptSrc = `http://${document.location.hostname}:8087/socket.io/socket.io.js`
socketScriptTag.src = socketScriptSrc
document.head.appendChild(socketScriptTag)

socketScriptTag.onload = () => {
  const socketHostName = document.location.hostname
  const socketURI = `http://${socketHostName}:8087/`
  const socket = io(socketURI)
  socket.on('user list res', (v) => {
    console.log(v)
  })
}
