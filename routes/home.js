const {express, router} = require('./basic');
const {room} = require('../bin/database/model')

router.get('/', (req, res, next) => {

  const infoTopTitle = 'NChat'
  const headTitle = infoTopTitle
  const nextButton = {
    name: '✿',
    href: `/user/${req.session.loginUser}`
  }

  // 已登陆则显示首页
  if (req.session.loginUser) {
    res.render('home', {
      infoTopTitle,
       headTitle,
       nextButton,
       user: req.session.loginUser,
    });
  }
  
  // 否则跳转登陆页面
  else {
    res.redirect('/login')
  }
});

module.exports = router
