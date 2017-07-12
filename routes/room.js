var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var databaseModel = require('../bin/database/model')
var room = databaseModel.room;
var mess = databaseModel.mess;


// 前端路由

router.get('/rooms/add', function(req, res, next) {
  if (req.session.loginUser) {
    res.render('roomAdd', {title: '添加房间'})
  }
  else {
    res.redirect('/login')
  }
})

router.get('/room/:id/member', function(req, res, next) {
  if (req.session.loginUser) {
    res.render('roomMember', {title: '在线成员', room: req.params.id})
  }
  else {
    res.redirect('/login')
  }
})

router.get('/room', function(req, res, next) {
  if (req.session.loginUser) {
    room.find({}, function(err, val) {
      if (err) {
        res.send('err: ' + err)
      }
      else if (val === null) {
        res.send('<h1>Room is not exist.</h1>')
      }
      else {
        room.find({}, function(err, val){
          res.render('roomList', {title: '房间列表', room: val});
        })
      }
    })
  }
  else {
    res.redirect('/login')
  }
})

router.get('/room/:id', function(req, res, next) {
  if (req.session.loginUser) {
    // 修改房间名（线上代码修改方案）
    room.find({name: 'NodeJS Chat Room'}, function(err, val) {
      if (err) {
        console.log(err)
      }
      else if (val === null) {
        console.log(null)
      }
      else {
        for(var i = 0; i < val.length; i++){
          room.update({name: 'NodeJS Chat Room'}, {$set: {name: 'center'}}, function(err){
            if (err) {
              console.log(err)
            }
          })
        }
      }
    })
    // 修改历史聊天记录的房间名（线上代码修改方案）
    mess.find({room: 'Chat Room'}, function(err, val) {
      if (err) {
        console.log(err)
      }
      else if (val === null) {
        console.log(null)
      }
      else {
        for(var i = 0; i < val.length; i++){
          mess.update({room: 'Chat Room'}, {$set: {room: 'center'}}, function(err){
            if (err) {
              console.log(err)
            }
          })
        }
      }
    })
    room.findOne({name: req.params.id}, function(err, val) {
      if (err) {
        res.send('err: ' + err)
      }
      else if (val === null) {
        res.send('<h1>Room is not exist.</h1>')
      }
      else {
        room.find({}, function(err, val){
          var roomObj = val.find(function(el,i,arr){
            return el.name === req.params.id
          })
          var desc = roomObj.desc
          res.render('room', {title: req.params.id, desc: desc, room: val, roomId: req.params.id});
        })
      }
    })
  }
  else {
    res.redirect('/login')
  }
});

// 后端API

// 房间列表

router.get('/api/room', function(req, res, next) {
  room.find({}, function(err, val){
    if (val!==null) {
      res.send(val)
    }
    else {
      res.send({msgCode:404, msgCtx: 'Has not any room.'})
    }
  })
})

// 房间信息
router.get('/api/room/info/:id', function(req, res, next) {
  room.findOne({name: req.params.id}, function(err, val){
    if (val !== null) {
      res.send(val)
    }
    else {
      res.send({msgCode:404, msgCtx: 'Room is not exist.'})
    }
  })
})

// 添加房间
router.post('/api/room/add', function(req, res, next) {
  room.findOne({name: req.body.name}, function(err, val){
    if (err) {
      res.send({msgCode:500, msgCtx: err})
    }
    else if (val !== null) {
      res.send({msgCode:404, msgCtx: 'Room is exist.'})
    }
    else {
      name = req.body.name
      desc = req.body.desc || '暂时没有简介。'
      roomSave = new room({
        name: name,
        desc: desc
      })
      roomSave.save()
      res.send({msgCode:200, msgCtx: 'Room add success.'})
    }
  })
})

// 房间记录
router.get('/api/room/mess/:id', function(req, res, next) {
  room.findOne({name: req.params.id}, function(err, val){
    if (val !== null) {
      mess.find({room: req.params.id}, function(errChild, valChild) {
        if (val !== null) {
          res.send(valChild)
        }
        else {
          res.send([{msgCode:20, msgCtx: 'Has not found any mess.'}])
        }
      })
    }
    else {
      res.send([{msgCode:404, msgCtx: 'Room is not exist.'}])
    }
  })
})

module.exports = router