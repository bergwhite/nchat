var express = require('express');
var router = express.Router();

router.get('/room/:id', function(req, res, next) {
  res.render('index', { title: '房间 /  ' + req.params.id });
});

module.exports = router