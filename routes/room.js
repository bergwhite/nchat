var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var databaseModel = require('../bin/database/model')
var room = databaseModel.room;
var mess = databaseModel.mess;


// 前端路由
router.get('/room/:id', function(req, res, next) {
  res.render('index', { title: '房间 /  ' + req.params.id });
});

// 后端API

// 房间信息
router.get('/api/room/:id', function(req, res, next) {
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
    if (val !== null) {
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
    }
  })
})

// 房间记录
router.get('/api/room/:id/mess', function(req, res, next) {
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