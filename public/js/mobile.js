function isMobile() {
  var pcState = false
  var x = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'].map(function(e){
    if(navigator.userAgent.indexOf(e) !== -1) pcState = true
  })
  return pcState
}

if (!isMobile()) {
  document.location = '/tip/pc'
}

function startResponse() {
  var pageScale = 1 / window.devicePixelRatio;
  document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ', minimum-scale=' + pageScale + ', user-scalable=no');
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'
}

startResponse()

window.onresize = function () {
  startResponse()
}