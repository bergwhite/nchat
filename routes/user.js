const {router, jwtDec} = require('./basic');
const {info, user} = require('../bin/database/model')
const crypto = require('crypto')
const md5 = crypto.createHash('md5');

const siteName = 'NChat'

function cryptoPass (user, pass) {
  const uniquePassKey = '2333666'
  const uniqueString = `${user}${uniquePassKey}${pass}`
  return require('crypto').createHash('md5').update(uniqueString).digest('hex');
}

// 用户列表
router.get('/user', (req, res, next) => {

  const infoTopTitle = `用户列表`
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/',
  }

  // 把查询到的用户信息渲染到页面
  // 如果查询过程中出现错误或用户不存在，则发送对应信息到前端页面
  info.find({}, (err,val) => {
    if (err) {
      res.send(`<h1>err: ${err}</h1>`)
    }
    else if (val === null) {
      res.send('<h1>用户不存在，请<a href="/register">注册</a></h1>')
    }
    else {
      const userList = val
      const renderObj = {
        headTitle,
        infoTopTitle,
        prevButton,
        userList,
      }
      res.render('userList', renderObj)
    }
  })
})

// 用户资料页面
router.get('/user/:id', (req, res, next) => {

  const infoTopTitle = `${req.params.id}的主页`
  const headTitle = `${infoTopTitle} - ${siteName}`
  jwtDec(req.cookies.token).then((tokenObj) => {
    const tokenObjUser = tokenObj.user
    const prevButton = {
      name: '<',
      href: '/',
    }
    const nextButton = {
      name: '?',
      href: `/user/${tokenObjUser}/mod`,
    }

    // 把查询到的用户信息渲染到页面
    // 如果查询过程中出现错误或用户不存在，则发送对应信息到前端页面
    info.findOne({user: req.params.id}, (err,val) => {
      if (err) {
        res.send(`<h1>err: ${err}</h1>`)
      }
      else if (val === null) {
        res.send('<h1>用户不存在，请<a href="/register">注册</a></h1>')
      }
      else {
        const renderObjBase = {
          headTitle,
          infoTopTitle,
          prevButton,
          user: val.user,
          gender: val.gender,
          img: val.img,
          city: val.city,
          hobbies: val.hobbies,
        }
        let renderObj = {}
        if (tokenObjUser === req.params.id) {
          renderObj = Object.assign({}, renderObjBase, {nextButton})
        }
        else {
          renderObj = Object.assign({}, renderObjBase)
        }
        res.render('userInfo', renderObj)
      }
    })
  })
})

// 用户资料修改页面
router.get('/user/:id/mod', (req, res, next) => {

  jwtDec(req.cookies.token).then((tokenObj) => {
    const tokenObjUser = tokenObj.user
    const infoTopTitle = `修改资料`
    const headTitle = `${infoTopTitle} - ${siteName}`
    const prevButton = {
      name: '<',
      href: `/user/${tokenObjUser}`,
    }
    const nextButton = {
      name: '√',
      href: '',
    }
    if (tokenObjUser !== req.params.id) {
      res.redirect('/')
    }
    info.findOne({user: tokenObjUser}, (err,val) => {
      if (val === null) {
        res.send('<h1>用户不存在，请<a href="/register">注册</a></h1>')
      }
      else {
        const renderObj = {
          headTitle,
          infoTopTitle,
          prevButton,
          nextButton,
          user: val.user,
          gender: val.gender,
          img: val.img,
          city: val.city,
          hobbies: val.hobbies,
        }
        res.render('userInfoMod', renderObj)
      }
    })
  })
})

// 登陆页面
router.get('/login', (req, res, next) => {

  user.find({}, (err, val) => {
    if (err) {
      console.log(err)
    }
    else if (val !== null) {
      // 对未更新成加密密码的进行替换
      for(let i = 0; i < val.length; i++){
        const userName = val[i].name
        const userPass = val[i].pass
        const encPass = cryptoPass(userName, userPass)
        if (userPass.length < 30) {
          user.update({name: userName}, {
            $set: {
              pass: encPass,
            }
          }, (err) => {
            if (err) {
              console.log(`updateCryptoedPass: ${err}`)
            }
          })
        }
      }
    }
  })

  const infoTopTitle = `登陆`
  const headTitle = `${infoTopTitle} - ${siteName}`

  res.render('userLogin', {headTitle,})
})

// 忘记密码页面
router.get('/forget', (req, res, next) => res.send('<h1>Page is building.</h1>') )

// 修改密码页面
router.get('/changepass', (req, res, next) => res.send('<h1>Page is building.</h1>') )

// 关于页面

router.get('/about', (req, res, next) => {

  const infoTopTitle = `关于`
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: `/`,
  }
  res.render('about', {
    headTitle,
    infoTopTitle,
    prevButton,
  })

})

router.get('/tip/pc', (req, res, next) => {

  const infoTopTitle = `跳转提示`
  const headTitle = `${infoTopTitle} - ${siteName}`

  res.render('tipGoToMobile', {
    infoTopTitle,
    headTitle,
  })
})

module.exports = router
