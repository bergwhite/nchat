var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var databaseModel = require('../bin/database/model')
var room = databaseModel.room;

router.get('/', function(req, res, next) {
  room.find({}, function(err, val) {
    if (err) {
      res.send('err: ' + err)
    }
    else if (val===null) {
      res.send('<h1>Room is not exist.</h1>')
    }
    else {
      res.render('index', { title: '大众聊天室', user: req.session.loginUser, room: val});
    }
  })
});

module.exports = router