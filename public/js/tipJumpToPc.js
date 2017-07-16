(() => {
  // 动态获取并修改PC端的地址
  const pcEdition = document.getElementsByClassName('pc-editon')[0]
  const pcEditionUrl = document.location.origin.replace('8086', '8088')
  pcEdition.href = pcEditionUrl
})()
