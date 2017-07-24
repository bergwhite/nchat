(() => {

  // 判断否是移动端
  function isMobile() {
    const checkList = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let checkState = false
    checkList.map((e) => {
      if(navigator.userAgent.indexOf(e) !== -1) checkState = true
    })
    return checkState
  }

  // 非移动端跳转至PC页
  /*if (!isMobile()) {
    const PCPage = document.location.origin.replace('8086', '8088')
    document.location = PCPage
  }*/

  // 适配不同的高精度屏幕
  function compatibleDifferentDPI() {
    // 检测视图缩放比
    const pageScale = 1 / window.devicePixelRatio;
    // 缩放视图
    document.querySelector('meta[name="viewport"]').setAttribute('content',`initial-scale=${pageScale}, maximum-scale=${pageScale}, minimum-scale=${pageScale}, user-scalable=no`);
    // 设置根字体大小
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'
  }

  compatibleDifferentDPI()

  window.onresize = () => compatibleDifferentDPI()

})();
