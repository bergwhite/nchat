const roomListDOM = document.getElementsByClassName('box-list-wrap')[0]

// 通过计算获取聊天框的合适高度
function changeRoomListHeight() {
  const documentHeight = document.documentElement.clientHeight
  const topTitleDOMHeight = topTitleDOM.offsetHeight
  const roomListDOMHeight = documentHeight - topTitleDOMHeight
  roomListDOM.style.height = `${roomListDOMHeight}px`
}

document.body.onload = () => changeRoomListHeight()