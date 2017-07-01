var basic = require('./basic');
var express = basic.express;
var router = basic.router;

router.get('/room/:id', function(req, res, next) {
  res.render('index', { title: '房间 /  ' + req.params.id });
});

module.exports = router