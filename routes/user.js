var express = require('express');
var router = express.Router();
var info = require('../database/index.js').info;

router.get('/api/user/:id/register', function(req, res, next) {
  res.send({status: "success"});
});
router.get('/api/user/:id/login', function(req, res, next) {
  res.send({status: "success"});
});
var express = require('express');
var router = express.Router();
var info = require('../database').info;

router.get('/api/user/:id/logout', function(req, res, next) {
  res.send({status: "success"});
});
// 用户资料路由
router.get('/api/user/:id', function(req, res, next) {
  // 获取用户资料
  info.findOne({user: req.params.id},function(err,val){
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

module.exports = router