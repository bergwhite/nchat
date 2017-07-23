const {express, router} = require('./basic');
const {info, user} = require('../bin/database/model')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const md5 = crypto.createHash('md5');

const siteName = 'NChat'

function cryptoPass (user, pass) {
  const uniquePassKey = '2333666'
  const uniqueString = `${user}${uniquePassKey}${pass}`
  return require('crypto').createHash('md5').update(uniqueString).digest('hex');
}

/*
 * 前端路由
 */

// 用户列表
router.get('/user', (req, res, next) => {

  const infoTopTitle = `用户列表`
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/',
  }

  // 已登录则继续
  // 未登录则跳转到登陆页面
  if (req.session.loginUser) {

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
  }
  else {
    res.redirect('/login')
  }
})

// 用户资料页面
router.get('/user/:id', (req, res, next) => {

  const infoTopTitle = `${req.params.id}的主页`
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/',
  }
  const nextButton = {
    name: '?',
    href: `/user/${req.session.loginUser}/mod`,
  }

  // 已登录则继续
  // 未登录则跳转到登陆页面
  if (req.session.loginUser) {

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
        if (req.session.loginUser === req.params.id) {
          console.log(2333)
          renderObj = Object.assign({}, renderObjBase, {nextButton})
          console.log(renderObj)
        }
        else {
          renderObj = Object.assign({}, renderObjBase)
        }
        res.render('userInfo', renderObj)
      }
    })
  }
  else {
    res.redirect('/login')
  }
})

// 用户资料修改页面
router.get('/user/:id/mod', (req, res, next) => {

  const infoTopTitle = `修改资料`
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: `/user/${req.session.loginUser}`,
  }
  const nextButton = {
    name: '√',
    href: '',
  }

  // 如果用户已登录，并且登陆的用户和需要修改资料的用户一致则继续
  // 否则跳转到登陆页面
  if (req.session.loginUser && req.session.loginUser === req.params.id) {
    if (req.session.loginUser !== req.params.id) {
      res.redirect('/')
    }
    info.findOne({user: req.params.id}, (err,val) => {
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
  }
  else {
    res.redirect('/login')
  }
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
        console.log(`${userName} : ${userPass} : ${userPass.length} : ${encPass}`)
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

  // 如果已登录则跳转到首页
  // 否则显示登陆页面
  if (req.session.loginUser) {
    res.redirect('/')
  }
  else {
    res.render('userLogin', {headTitle,})
  }
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

  if (req.session.loginUser) {
    res.render('about', {
      headTitle,
      infoTopTitle,
      prevButton,
    })
  }
  else {
    res.redirect('/login')
  }

})

/*
 * 后端API
 */

// 用户列表
router.get('/api/user', (req, res, next) => {
  info.find({}, (err, val) => {
    if (val!==null) {
      res.send({
        msgCode:200,
        msgCtx: val,
      })
    }
    else {
      res.send({
        msgCode:404,
        msgCtx: 'Has not any user.',
      })
    }
  })
})

// 用户注册
router.post('/api/user/register', (req, res, next) => {

  // 用户已登录或者请求头中为包含相关信息，则进行提示
  if (req.session.loginUser) {
    res.send({
      msgCode:304,
      msgCtx: 'You have logined.',
    })
  }
  else if (!req.body) {
    res.send({
      msgCode:304,
      msgCtx: 'Please enter the entire form value.',
    });
  }
  else {
    user.findOne({
      name: req.body.name,
    }, (err, val) => {

      // 用户已存在则返回已存在信息
      // 数据库操作过程中发生错误则进行相关提示
      // 否则继续执行
      if (err) {
        res.send({
          msgCode:500,
          msgCtx: err,
        })
      }
      else if (val !== null) {
        res.send({
          msgCode:304,
          msgCtx: 'User is exist.',
        })
      }
      else {
        const defaultUserImg = 'https://randomuser.me/api/portraits/men/1.jpg'

        // 设置别名
        const name = req.body.name
        const pass = cryptoPass(name, req.body.pass)

        // 保存账号
        userSave = new user({
          name: name,
          pass: pass,
        })
        userSave.save()

        // 保存资料
        infoSava = new info({
          user: name,
          gender: 'secure',
          img: defaultUserImg,
          city: 'beijing',
          hobbies: [],
        })
        infoSava.save()

        // 生成Session
        req.session.regenerate((err) => {
          if (err) {
            res.send({
              msgCode:500,
              msgCtx: `Session regenerate err: ${err}`,
            })
          }
          else {
            req.session.loginUser = name;  // 保存Session
            res.send({
              msgCode:200,
              msgCtx: 'Reg success & logined.',
            })
          }
        });
      }
    })
  }
});

// 用户登陆
router.post('/api/user/login', (req, res, next) => {

  // 未登录则执行
  // 已登录则提示已登陆
  // POST中没有数据则进行提示

  if (req.session.loginUser) {
    res.send({
      msgCode:304,
      msgCtx: 'You have already logined.',
    })
  }
  else if (!req.body) {
    res.send({
      msgCode:304,
      msgCtx: 'Please enter the entire form value.',
    });
  }
  else {

    // 设置别名
    const name = req.body.name
    const pass = cryptoPass(name, req.body.pass)
    console.log(`name: ${name} , pass: ${pass}`)

    // 查询数据库中发生错误或者用户名不存在、密码错误则进行相应的提示
    user.findOne({
      name: name,
    }, (err, val) => {
      if (err) {
        res.send({
          msgCode:500,
          msgCtx: err,
        })
      }
      else if (val === null) {
        res.send({
          msgCode:404,
          msgCtx: 'User is not exist.',
        })
      }
      else if(val.pass !== pass) {
        res.send({
          msgCode:403,
          msgCtx: `Pass is incorrect.`,
        })
      }
      else {
        req.session.regenerate((err) => {
          if(err){
            res.send({
              msgCode:500,
              msgCtx: `User login fail: ${err}`,
            });
          }
          else {
            req.session.loginUser = name;  // 保存Session
            res.send({
              msgCode:200,
              msgCtx: 'Login success.',
            })
          }
        });
      }
    })
  }
});

// 注销登陆
router.post('/api/user/logout', (req, res, next) => {

  // 已登录则执行
  // 未登录则提示未登陆
  if (req.session.loginUser) {
    req.session.destroy((err) => {
      if(err){
        res.send({
          msgCode:500,
          msgCtx: `User logout fail: ${err}`,
        });
      }
      else {
        res.clearCookie('key');  // 清除Session
        res.send({
          msgCode:200,
          msgCtx: 'User logout success.',
        });
      }
    });
  }
  else {
    res.send({
      msgCode:304,
      msgCtx: 'You have not login.',
    })
  }
});

// 用户资料
router.get('/api/user/info/:id', (req, res, next) => {

  // 获取用户资料
  info.findOne({
    user: req.params.id,
  }, (err,val) => {
    if (err) {
      res.send({
        msgCode:304,
        msgCtx: err,
      })
    }
    else if (val === null) {
      res.send({
        msgCode:404,
        msgCtx: 'User not exist.',
      })
    }
    else {
      res.send({
        msgCode:200,
        msgCtx: val,
      });
    }
  })
});

// 修改密码
router.put('/api/user/pass', (req, res, next) => {

  // 已登录则执行
  // 未登录则提示请登陆
  if (req.session.loginUser) {

    // 带了请求参数则执行
    // 未带参数则返回提示信息
    if (req.body) {
      const userName = req.session.loginUser
      const passOld = cryptoPass(userName, req.body.passOld)
      const passNew = cryptoPass(userName, req.body.passNew)

      // 查询当前用户的账号
      user.findOne({
        name: userName,
      }, (err, val) => {

        // 输入的旧密码等于原始密码则执行
        // 不相等则返回提示信息
        if (val.pass === passOld) {

          // 更新成新密码
          user.update({
            name: userName,
          }, {
            $set: {
              pass: passNew,
            },
          }, (err) => {
            if (err) {
              res.send({
                msgCode:304,
                msgCtx: err,
              })
            }
            else {
              res.send({
                msgCode:200,
                msgCtx: 'Pass is changed.',
              })
            }
          })
        }
        else {
          res.send({
            msgCode:304,
            msgCtx: 'Old password is incorrect.',
          })
        }
      })
    }
    else {
      res.send({
        msgCode:304,
        msgCtx: 'Please enter oldPass and newPass.',
      })
    }
  }
  else {
    res.send({
      msgCode:401,
      msgCtx: 'Please login.',
    })
  }
})

// 修改个人信息
router.put('/api/user/info', (req, res, next) => {

  // 已登录则执行
  // 未登录则提示请登陆
  if (req.session.loginUser) {

    // 带了请求参数则执行
    if (req.body) {

      // 用户资料别名
      const userName = req.session.loginUser
      const userGender = req.body.gender
      const userImg = req.body.img
      const userCity = req.body.city
      const userHobbies = req.body.hobbies.split(',')

      // 查询当前用户的账号
      info.findOne({
        user: userName,
      }, (err, val) => {

        // 更新资料
        info.update({
          user: userName,
        }, {$set: {
          gender: userGender,
          img: userImg,
          city: userCity,
          hobbies: userHobbies,
        }}, (err) => {

          // 提示错误信息
          if (err) {
            res.send({
              msgCode:304,
              msgCtx: err,
            })
          }

          // 提示成功
          else {
            console.log(userGender)
            console.log(userImg)
            console.log(userCity)
            console.log(userHobbies)
            res.send({
              msgCode:200,
              msgCtx: 'User info is changed.',
            })
          }
        })
      })
    }

    // 提示在请求中带参数
    else {
      res.send({
        msgCode:304,
        msgCtx: 'Please enter user info.',
      })
    }
  }
  else {
    res.send({
      msgCode:401,
      msgCtx: 'Please login.',
    })
  }
})

module.exports = router
