const jwt = require('jsonwebtoken');

// 密钥
const pubKey = 'secr'

// JWT加密
function jwtEnc(user, pass) {
  const token = jwt.sign({
    user: user,
    pass: pass,
    isToken: true,
    iat: Math.floor(Date.now() / 1000) + (60 * 60)
  }, pubKey)
  return token
}

// JWT解密
// 返回Promise对象
function jwtDec(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, pubKey, function(err, val){
      // 捕获到错误则拒绝
      if (err) {
        reject('Tooken is invaild')
      }
      // 否则返回处理成功
      else {
        resolve(val)
      }
    })
  })
}

module.exports = {
  jwtEnc,
  jwtDec
}