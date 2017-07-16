(() => {
  /*
   * Why: Socket的端口和页面端口不一致，所以不能用相对路径，只能用绝对路径。
   * What: 本地开发的Host是localhost，在线的是对应的主机名。因此需要动态获取host名。
   * How: 为了保持开发和部署的一直，使用JS动态输出script标签。
   */
  const socketScriptTag = document.createElement('script')
  const socketScriptSrc = `http://${document.location.hostname}:8087/socket.io/socket.io.js`
  socketScriptTag.src = socketScriptSrc
  document.head.appendChild(socketScriptTag)
  // index.min.js依赖socket.io.js
  // 所以要在socket文件加载完成后再加载index.min.js
  socketScriptTag.onload = () => {
    const indexScriptTag = document.createElement('script')
    indexScriptTag.src = '/js/index.min.js'
    document.body.appendChild(indexScriptTag)
  }
})()
