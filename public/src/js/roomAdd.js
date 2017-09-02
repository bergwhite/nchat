(() => {
  const roomName = document.getElementsByClassName('add-info-name')[0]
  const roomDesc = document.getElementsByClassName('add-info-desc')[0]
  const infoSubmitBtn = document.getElementsByClassName('top-next')[0]
  const infoSubmitTip = document.getElementsByClassName('add-info-tip')[0]
  const siteOrigin = document.location.origin
  const ajaxUrl = `${siteOrigin}/api/room/add`

  // 页面加载完成时，聚焦房间名字输入框
  document.body.onload = () => roomName.focus()

  // 监听提交按钮
  infoSubmitBtn.addEventListener('click', (e) => {
    // 阻止链接默认事件
    e.preventDefault()
    // 信息输入完整则提交，未输入完整则提示
    if (roomName.value === '') {
      infoSubmitTip.innerText = '请输入名称'
      roomName.focus()
    }
    else if (roomDesc.value === '') {
      infoSubmitTip.innerText = '请输入描述'
      roomDesc.focus()
    }
    else {
      submitNewRoomInfo()
    }
  }, false)

  // 新房间提交函数
  function submitNewRoomInfo() {
    const token = localStorage.getItem('token')
    axios.post(`${ajaxUrl}?token=${token}`, {
      name: roomName.value,
      desc: roomDesc.value
    }).then((res) => {
      // 成功则跳转到房间列表
      if (res.data.msgCode === 200) {
        document.location = '/room'
      }
      // 否则显示返回的信息
      else {
        infoSubmitTip.innerText = res.data.msgCtx
        roomName.focus()
      }
    }).catch((err) => {
      // 如果捕获到错误，则进行提示
      infoSubmitTip.innerText = err
      roomName.focus()
    })
  }
})();
