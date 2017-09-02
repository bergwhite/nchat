const {express, router, jwtDec} = require('./basic');
const {room} = require('../bin/database/model')

router.get('/', (req, res, next) => {

  const infoTopTitle = 'NChat'
  const headTitle = infoTopTitle
  const token = req.cookies.token
  jwtDec(token).then((val) => {
    const nextButton = {
      name: '✿',
      href: `/user/${val.user}`
    }
    res.render('home', {
      infoTopTitle,
       headTitle,
       nextButton,
       user: val.user,
    });
  })
});

module.exports = router
