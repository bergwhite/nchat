var basic = require('./basic');
var express = basic.express;
var router = basic.router;
var databaseModel = require('../bin/database/model')
var room = databaseModel.room;

router.get('/', function(req, res, next) {
  if (req.session.loginUser) {
    room.find({}, function(err, val) {
      if (err) {
        res.send('err: ' + err)
      }
      else if (val===null) {
        res.send('<h1>Room is not exist.</h1>')
      }
      else {
        res.render('home', { title: 'NodeJS Chat', user: req.session.loginUser, room: val});
      }
    })
  }
  else {
    res.redirect('/login')
  }
});

module.exports = router