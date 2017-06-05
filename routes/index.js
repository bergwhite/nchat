var express = require('express');
var router = express.Router();
var user = require('../database').user;
console.log(user.find())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '大众聊天室' });
});
router.get('/room/:id', function(req, res, next) {
  res.render('index', { title: '房间 /  ' + req.params.id });
});
router.get('/user', function(req, res, next) {
  res.render('userList', { title: req.params.id });
});
router.get('/user/:id', function(req, res, next) {
  res.render('userCenter', { title: req.params.id });
});
router.get('/user/:id/register', function(req, res, next) {
  res.send({status: "success"});
});
router.get('/user/:id/login', function(req, res, next) {
  res.send({status: "success"});
});
router.get('/user/:id/logout', function(req, res, next) {
  res.send({status: "success"});
});
// 用户资料路由
router.get('/user/:id/info', function(req, res, next) {
  // 获取用户资料
  user.findOne({name: req.params.id},function(err,val){
    // 如果当前用户不存在
    // 返回错误信息
    if (val === null) {
      res.send({errCode:404, errMess: 'User not exist.'})
    }
    // 返回用户信息
    else {
      res.send(val);
    }
    console.log('/user/:id/info / val: ' + val)
    console.log('/user/:id/info / err: ' + err)
  })
});

module.exports = router;
