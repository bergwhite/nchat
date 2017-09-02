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

// 对未登录的页面进行重定向
app.use((req, res, next) => {
  console.log(req.originalUrl)
  const redrictWihteList = ['/login', '/api/']
  var pageWillRedirct = redrictWihteList.every((e) => {
    return req.originalUrl.indexOf(e) === -1
  })
  if (pageWillRedirct && !req.cookies.token) {
    res.redirect('/login')
  }
  else {
    next()
  }
})

app.use('/', router.home);
app.use('/room', router.room);
app.use('/user', router.user);

module.exports = {
  express,
  app,
};
