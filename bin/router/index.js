const {express, app} = require('./base.js')
const {jwtEnc, jwtDec} = require('../jwt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors')
const routerRoom = require('./routerRoom')
const routerUser = require('./routerUser')

// 支持跨域
app.use(cors())

// 支持Session
// app.use(session({
//   name: 'key',
//   secret: 'whocarewhatisthepass',  // 用来对session id相关的cookie进行签名
//   store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
//   saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
//   resave: false,  // 是否每次都重新保存会话，建议false
//   cookie: {
//     maxAge: 7 * 24 * 60 * 60 * 1000  // 有效期，单位是毫秒
//   }
// }));

// body和cookie中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Token认证中间件
app.use((req, res, next) => {
  // token认证白名单
  const whiteList = ['/api/user/register', '/api/user/login', '/favicon.ico']
  const robotWhiteList = ['/api/robot']
  const originalUrl = req.originalUrl
  if (whiteList.indexOf(originalUrl) !== -1  || originalUrl.indexOf(robotWhiteList[0]) !== -1) {
    next()
  }
  else if (req.query.token) {
    const token = req.query.token
    jwtDec(token).then((val) => {
      next();
    })
    .catch((err) => {
      res.json({msgCode: 500,msgCtx: err})
    })
  }
  else {
    res.json({msgCode: 401,msgCtx: 'Please request with token.'})
  }
});

// POST中间件
app.post((req, res, next) => {
  if (!req.body) {
    res.send({
      msgCode:304,
      msgCtx: 'Please enter user info.',
    })
  }
  else {
    next()
  }
});

// 启用路由
app.use(routerRoom)
app.use(routerUser)

// 支持跨域访问聊天机器人
app.use('/api/robot', proxy({
  target: 'http://www.tuling123.com',
  changeOrigin: true
}));

module.exports = app