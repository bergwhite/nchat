const jwt = require('jsonwebtoken');

// 密钥
const pubKey = 'secr'

// JWT加密
function jwtEnc(user, pass) {
  const token = jwt.sign({
    user: user,
    pass: pass,
    isToken: true,
    iat: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1)
  }, pubKey)
  return token
}

// JWT解密
// 返回Promise对象
function jwtDec(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, pubKey, function(err, tokenObj){
      // 捕获到错误或token过期则拒绝
      if (err || tokenObj.iat < (Date.now() / 1000)) {
        reject('Tooken is invaild')
      }
      // 否则返回处理成功
      else {
        resolve(tokenObj)
      }
    })
  })
}

module.exports = {
  jwtEnc,
  jwtDec
}