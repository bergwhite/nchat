const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const router = require('./routes/index');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist')));

// 支持Session
app.use(session({
  name: 'key',
  secret: 'whocarewhatisthepass',  // 用来对session id相关的cookie进行签名
  store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000  // 有效期，单位是毫秒
  }
}));

app.use('/', router.home);
app.use('/room', router.room);
app.use('/user', router.user);

module.exports = {
  express,
  app,
};
