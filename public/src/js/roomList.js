(() => {
  const roomListDOM = document.getElementsByClassName('full-list')[0]
  const topTitleDOM = document.getElementsByClassName('top-title')[0]

  // 通过计算获取房间列表的合适高度
  function changeRoomListHeight() {
    const documentHeight = document.documentElement.clientHeight
    const topTitleDOMHeight = topTitleDOM.offsetHeight
    const roomListDOMHeight = documentHeight - topTitleDOMHeight
    roomListDOM.style.height = `${roomListDOMHeight}px`
  }

  // 视窗改变时重新计算高度
  window.addEventListener('resize', () => changeRoomListHeight(), false)

  // 文档加载完成时重新计算高度
  document.body.onload = () => changeRoomListHeight()
})()
