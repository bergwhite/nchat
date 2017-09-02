const {express, router, jwtDec} = require('./basic');
const {room} = require('../bin/database/model')

router.get('/', (req, res, next) => {

  const infoTopTitle = 'NChat'
  const headTitle = infoTopTitle
  const token = req.cookies.token
  jwtDec(token).then((tokenObj) => {
    const tokenObjUser = tokenObj.user
    const nextButton = {
      name: '✿',
      href: `/user/${tokenObjUser}`
    }
    res.render('home', {
      infoTopTitle,
       headTitle,
       nextButton,
       user: tokenObjUser,
    });
  })
});

module.exports = router
