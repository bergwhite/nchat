var basic = require('./basic');
var express = basic.express;
var router = basic.router;

router.get('/', function(req, res, next) {
  res.render('index', { title: '大众聊天室' });
});

module.exports = router