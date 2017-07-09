var bodyParser = require('body-parser')
var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var databaseModel = require('../bin/database/model')
var info = databaseModel.info;
var user = databaseModel.user;

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

router.get('/api/isUserExise/:id', function(req, res, next) {
  user.findOne({name: req.params.id}, function(err, val){
    if (val !== null) {
      res.send(true)
    }
    else {
      res.send(false)
    }
  })
})

/* 后端API */

// 用户列表

router.get('/api/user', function(req, res, next) {
  user.find({}, function(err, val){
    if (val!==null) {
      res.send(val)
    }
    else {
      res.send({msgCode:404, msgCtx: 'Has not any user.'})
    }
  })
})

// 注册
router.post('/api/user/register', function(req, res, next) {

  user.findOne({name: req.body.name}, function(err, val){

    // 用户已存在则直接返回提示信息
    if (val !== null) {
      res.send({msgCode:304, msgCtx: 'User is exist.'})
    }

    else {

      // POST中没有数据则进行提示
      if (!req.body) {
        res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
      }

      else if (!false) {

        // 设置别名
        var name = req.body.name
        var pass = req.body.pass

        // 生成账号
        userSave = new user({
          name: name,
          pass: pass
        })
        userSave.save()

        // 生成资料
        infoSava = new info({
          user: name,
          gender: 'secure',
          img: '',
          city: 'beijing',
          hobbies: []
        })
        infoSava.save()

        // 生成Session
        req.session.regenerate(function(err) {

          if (err) {
            res.send({msgCode:500, msgCtx: 'Reg success but not logined.'})
          }

          else {

            // 保存Session
            req.session.loginUser = name;
            res.send({msgCode:200, msgCtx: 'Reg success & logined.'})
          }
        });
      }

      else {
        res.send({msgCode:304, msgCtx: 'User is exist.'});
      }
    }
  })
  // res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'})
});

// 登陆
router.post('/api/user/login', function(req, res, next) {

  // POST中没有数据则进行提示
  if (!req.body) {
    res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
  }

  else if (!false) {

    // 设置别名
    var name = req.body.name
    var pass = req.body.pass

    user.findOne({name: name}, function(err, val) {
      // 错误提示
      if (err) {
        return res.send({msgCode:500, msgCtx: err})
      }
      else if(req.session.loginUser) {
        return res.send({msgCode:304, msgCtx: 'You have logined.'})
      }
      // 用户不存在提示
      else if (val === null) {
        return res.send({msgCode:404, msgCtx: 'User is not exist.'})
      }

      // 密码错误提示
      else if(val.pass !== pass) {
        return res.send({msgCode:404, msgCtx: 'Pass is incorrect.'})
      }

      else {

        // 存在Session则提示已登录
        if (req.session.loginUser) {
          return res.send({msgCode:304, msgCtx: 'You have alread logined.'});
        }

        // 否则重新生成Session
        else {
          req.session.regenerate(function(err) {

            // 错误提示
            if(err){
              return res.send({msgCode:404, msgCtx: 'Login fail.'});
            }

            // 登陆成功提示
            else {
              req.session.loginUser = name;
              return res.send({msgCode:200, msgCtx: 'Login success.'})
            }
          });
        }
      }
    })
  }

  // 登陆失败提示
  else {
    res.send({msgCode:1001, msgCtx: 'User login fail.'});
  }
});

// 注销
router.post('/api/user/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err){
      res.send({msgCode:404, msgCtx: 'User logout fail.'});
      return;
    }
    // req.session.loginUser = null;
    res.clearCookie('key');
    return res.send({msgCode:200, msgCtx: 'User logout success.'});
    // res.redirect('/');
  });
});

// 个人资料
router.get('/api/user/info/:id', function(req, res, next) {
  // 获取用户资料
  info.findOne({user: req.params.id}, function(err,val){
    // 如果当前用户不存在
    // 返回错误信息
    console.log('val / ')
    console.log(val)
    if (val === null) {
      res.send({msgCode:404, msgCtx: 'User not exist.'})
    }
    // 返回用户信息
    else {
      res.send(val);
    }
    console.log('/api/user/info/:id / val: ' + val)
    console.log('/api/user/info/:id / err: ' + err)
  })
});

router.post('/api/user/pass', function(req, res, next) {
  // 已登录则执行
  if (req.session.loginUser) {
    // 带了请求参数则执行
    if (req.body) {
      // 用户和密码别名
      var userName = req.session.loginUser
      var passOld = req.body.passOld
      var passNew = req.body.passNew
      // 查询当前用户的账号
      user.findOne({name: userName}, function(err, val) {
        // 输入的旧密码等于原始密码则执行
        if (val.pass === passOld) {
          // 更新成新密码
          user.update({name: userName}, {$set: {pass: passNew}}, function(err){
            // 提示成功
            if (!err) {
              res.send({msgCode:200, msgCtx: 'Pass is changed.'})
            }
            // 提示错误信息
            else {
              res.send({msgCode:304, msgCtx: err})
            }
          })
        }
        // 旧密码错误
        else {
          res.send({msgCode:304, msgCtx: 'Old password is incorrect.'})
        }
      })
    }
    // 提示在请求中带参数
    else {
      res.send({msgCode:304, msgCtx: 'Please enter oldPass and newPass.'})
    }
  }
  // 提示需要登陆才能操作
  else {
    res.send({msgCode:304, msgCtx: 'Please login.'})
  }
})

router.post('/api/user/nick', function() {
  // isUserExist()
  // isUserLogin()
})

router.post('/api/user/info', function() {
  // isUserExist()
  // isUserLogin()
})

/* 前端路由 */
// 个人资料
/**
 * {user, gender, img, city, hobbies[]}
 */

router.get('/user/:id', function(req, res, next) {
  info.findOne({user: req.params.id}, function(err,val){
    if (val === null) {
      res.send('<h1>404</h1>')
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
  res.render('userLogin', {user: req.session.loginUser})
})

// 注册页面
router.get('/register', function(req, res, next) {
  console.log(req.session.loginUser)
  res.render('userRegister', {user: req.session.loginUser})
})

module.exports = router