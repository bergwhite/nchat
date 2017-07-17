const basic = require('./basic');
const express = basic.express;
const router = basic.router;
const databaseModel = require('../bin/database/model')
const room = databaseModel.room;

router.get('/', (req, res, next) => {

  // 已登陆则显示首页
  if (req.session.loginUser) {
    res.render('home', { title: 'NodeJS Chat', user: req.session.loginUser});
  }
  
  // 否则跳转登陆页面
  else {
    res.redirect('/login')
  }
});

module.exports = router
