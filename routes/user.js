/*

PersonModel.findById(id,function(err,person){
      person.name = 'MDragon';
      var _id = person._id; //需要取出主键_id
      delete person._id;    //再将其删除
      PersonModel.update({_id:_id},person,function(err){});
      //此时才能用Model操作，否则报错
    });

PersonModel.update({_id:_id},{$set:{name:'MDragon'}},function(err){});

Person.findByIdAndUpdate(_id,{$set:{name:'MDragon'}},function(err,person){
  console.log(person.name); //MDragon
});

findByIdAndRemove

如果是Entity，使用save方法，如果是Model，使用create方法

//使用Entity来增加一条数据
var krouky = new PersonModel({name:'krouky'});
krouky.save(callback);
//使用Model来增加一条数据
var MDragon = {name:'MDragon'};
PersonModel.create(MDragon,callback);

remove

*/

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
// 注册
router.post('/api/register', function(req, res, next) {
  user.findOne({name: req.body.name}, function(err, val){
    if (val !== null) {
      res.send({msgCode:200, msgCtx: 'User is exist.'})
    }
    else {
      if (!req.body) {
        res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
      }
      else if (!false) {
        var name = req.body.name
        var pass = req.body.pass

        userSave = new user({
          name: name,
          pass: pass
        })

        userSave.save()

        infoSava = new info({
          user: name,
          gender: 'secure',
          img: '',
          city: 'beijing',
          hobbies: []
        })

        infoSava.save()

        res.send({msgCode:200, msgCtx: 'Reg success.'})
      }
      else {
        res.send({msgCode:1001, msgCtx: 'User is exist.'});
      }
    }
  })
  // res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'})
});
// 登陆
router.post('/api/login', function(req, res, next) {
  if (!req.body) {
    res.send({msgCode:400, msgCtx: 'Please enter the entire form value.'});
  }
  else if (!false) {
    var name = req.body.name
    var pass = req.body.pass

    user.findOne({user: name, pass: pass}, function(err, val) {
      if (val===null) {
        res.send({msgCode:404, msgCtx: 'Name or password is incorrect.'})
      }
      else {
        res.send({msgCode:404, msgCtx: 'Login success.'})
      }
    })

    res.send({msgCode:200, msgCtx: 'User login  success.'})
  }
  else {
    res.send({msgCode:1001, msgCtx: 'User login fail.'});
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
    console.log('val / ')
    console.log(val)
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

router.post('/api/user/:id/pass', function() {
  // isUserExist()
  // isUserLogin()
})

router.post('/api/user/:id/nick', function() {
  // isUserExist()
  // isUserLogin()
})

router.post('/api/user/:id/info', function() {
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