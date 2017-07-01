var bodyParser = require('body-parser')
var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var database = require('../bin/database')
var info = database.info;
var user = database.user;

// 判断用户是否存在
function isUserExist(userName) {
  var existState = false
  user.findOne({name: userName}, function(err, val){
    if (val !== null) {
      console.log(existState)
      existState = true
      console.log(existState)
    }
  })
  return existState
}

// 判断用户是否存在
function isUserLogin(userName) {
  if(isUserExist(userName)) {

  }
}

router.post('/api/user/:id/register', function(req, res, next) {
  var isExist = isUserExist(req.body.name)
  if (!req.body) {
    res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
  }
  else if (!false) {
    var name = req.body.name
    var pass = req.body.pass
    userSave = new user({name: name, pass: pass})
    userSave.save()
    res.send({msgCode:200, msgCtx: 'Reg success.'})
  }
  else {
    res.send({msgCode:1001, msgCtx: 'User is exist.'});
  }
});
router.post('/api/user/:id/login', function(req, res, next) {
  if (!req.body) {
    res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
  }
  else if (!isUserExist(req.params.id)) {

  }
  else {
    res.send({msgCode:1011, msgCtx: 'User login fail.'});
  }
});
router.post('/api/user/:id/logout', function(req, res, next) {
  res.send({status: "success"});
});
// 用户资料路由
router.get('/api/user/:id', function(req, res, next) {
  // 获取用户资料
  console.log(req)
  info.findOne({user: req.params.id}, function(err,val){
    // 如果当前用户不存在
    // 返回错误信息
    if (val === null) {
      res.send({msgCode:404, msgCtx: 'User not exist.'})
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