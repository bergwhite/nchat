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

/* 后端API */
// 注册
router.post('/api/register', function(req, res, next) {
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
// 登陆
router.post('/api/login', function(req, res, next) {
  if (!req.body) {
    res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
  }
  else if (!isUserExist(req.params.id)) {

  }
  else {
    res.send({msgCode:1011, msgCtx: 'User login fail.'});
  }
});
// 注销
router.post('/api/logout', function(req, res, next) {
  res.send({status: "success"});
});
// 个人资料
router.get('/api/user/:id', function(req, res, next) {
  // 获取用户资料
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

/* 前端路由 */
// 个人资料
/**
 * {user, gender, img, city, hobbies[]}
 */
router.get('/user/:id', function(req, res, next) {
  info.findOne({user: req.params.id}, function(err,val){
    if (val === null) {
      res.send({msgCode:404, msgCtx: 'User not exist.'})
    }
    else {
      res.render('userInfo', {
        user: val.user,
        gender: val.gender,
        img: val.img,
        city: val.city,
        hobbies: val.hobbies
      })
    }
  })
})
// 登陆页面
router.get('/login', function(req, res, next) {
  res.render('userLogin')
})
// 注册页面
router.get('/register', function(req, res, next) {
  res.render('userRegister')
})

module.exports = router