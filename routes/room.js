const {express, router} = require('./basic');
const {room, mess} = require('../bin/database/model')

const siteName = 'NChat'

/*
 * 前端路由
 */

// 添加房间页面
router.get('/rooms/add', (req, res, next) => {

  const infoTopTitle = '添加房间'
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/room',
  }
  const nextButton = {
    name: '√',
    href: '',
  }

  // 已登录则显示页面
  if (req.session.loginUser) {
    res.render('roomAdd', {
      headTitle,
      infoTopTitle,
      prevButton,
      nextButton,
    })
  }

  // 否则跳转到登陆页面
  else {
    res.redirect('/login')
  }
})

// 用户信息页面
router.get('/room/:id/member', (req, res, next) => {

  const infoTopTitle = '在线成员'
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: `/room/${req.params.id}`,
  }

  // 已登录则显示页面
  if (req.session.loginUser) {
    res.render('roomMember', {
      headTitle,
      infoTopTitle,
      prevButton,
      room: req.params.id,
    })
  }

  // 否则跳转到登陆页面
  else {
    res.redirect('/login')
  }
})

// 房间列表页面
router.get('/room', (req, res, next) => {

  const infoTopTitle = '房间列表'
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/',
  }
  const nextButton = {
    name: '+',
    href: '/rooms/add',
  }

  // 已登录则显示页面
  if (req.session.loginUser) {
    room.find({}, (err, val) => {

      // 处理错误
      if (err) {
        res.send(`<h1>err: ${err}</h1>`)
      }

      // 房间为空时
      else if (val === null) {
        res.render('roomList', {
          headTitle,
          infoTopTitle,
          prevButton,
          nextButton,
          room: [],
        });
      }

      // 渲染房间列表
      else {
        room.find({}, (err, val) => {
          res.render('roomList', {
            headTitle,
            infoTopTitle,
            prevButton,
            nextButton,
            room: val,
          });
        })
      }
    })
  }

  // 否则跳转到登陆页面
  else {
    res.redirect('/login')
  }
})

// 具体房间页面
router.get('/room/:id', (req, res, next) => {

  const infoTopTitle = req.params.id
  const headTitle = `${infoTopTitle} - ${siteName}`
  const prevButton = {
    name: '<',
    href: '/room',
  }
  const nextButton = {
    name: '&',
    href: `/room/${req.params.id}/member`,
  }

  // 已登录则显示页面
  // 否则跳转到登陆页面
  if (req.session.loginUser) {

    // 查询房间是否存在
    // 操作数据库的过程中发生错误或房间不存在，则把提示发送到前端页面
    room.findOne({
      name: req.params.id,
    }, (err, val) => {
      if (err) {
        res.send(`<h1>err: ${err}</h1>`)
      }
      else if (val === null) {
        res.send('<h1>Room is not exist.</h1>')
      }
      else {

        // 查询当前房间的所有聊天记录
        // 查询到了则渲染页面
        // 如果操作数据库的过程中发生错误则把错误信息发送过去
        mess.find({
          room: req.params.id,
        }, (err, val) => {
          if (err) {
            res.send(`<h1>err: ${err}</h1>`)
          }
          else {
            res.render('room', {
              headTitle,
              infoTopTitle,
              prevButton,
              nextButton,
              room: val,
              roomId: req.params.id,
            })
          }
        })
      }
    })

    // 批量修改线上代码的房间名
    // 如果发送错误或房间未找到，则打印错误信息
    room.find({
      name: 'NodeJS Chat Room',
    }, (err, val) => {
      if (err) {
        console.log(`roomFindErr: ${err}`)
      }
      else if (val === null) {
        console.log('roomFind404: No room NodeJS Chat Room found.')
      }
      else {
        for(let i = 0; i < val.length; i++){
          room.update({
            name: 'NodeJS Chat Room',
          }, {
            $set: {
              name: 'center',
            }
          }, (err) => {
            if (err) {
              console.log(`roomUpdateErr: ${err}`)
            }
          })
        }
      }
    })

    // 批量修改线上代码聊天记录中的房间名
    // 如果发送错误或房间未找到，则打印错误信息
    mess.find({
      room: 'Chat Room',
    }, (err, val) => {
      if (err) {
        console.log(`<h1>roomChatErr: ${err}</h1>`)
      }
      else if (val === null) {
        console.log('roomFind404: No info about Chat Room.')
      }
      else {
        for(let i = 0; i < val.length; i++){
          mess.update({room: 'Chat Room'}, {
            $set: {
              room: 'center',
            }
          }, (err) => {
            if (err) {
              console.log(`roomChatUpdateErr: ${err}`)
            }
          })
        }
      }
    })
  }
  else {
    res.redirect('/login')
  }
});

/*
 * 后端API
 */

// 请求房间列表
router.get('/api/room', (req, res, next) => {

  // 如果查询到了房间则返回
  // 否则提示暂时没有任何房间
  // 操作数据库的过程中遇到错误则把错误返回给前端
  room.find({}, (err, val) => {
    if (err) {
      res.send({
        msgCode:500,
        msgCtx: err,
      })
    }
    else if (val!==null) {
      res.send({
        msgCode:200,
        msgCtx: val,
      })
    }
    else {
      res.send({
        msgCode:404,
        msgCtx: 'Has not any room.',
      })
    }
  })
})

// 请求房间信息
router.get('/api/room/info/:id', (req, res, next) => {

  // 如果房间存在则返回信息
  // 不存在则返回房间不存在的提示
  room.findOne({
    name: req.params.id,
  }, (err, val) => {
    if (val !== null) {
      res.send({msgCode: 200, msgCtx: val})
    }
    else {
      res.send({msgCode:404, msgCtx: 'Room is not exist.'})
    }
  })
})

// 请求添加房间
router.post('/api/room/add', (req, res, next) => {

  // 已登录则继续请求添加房间
  // 未登录则提示请登陆
  if (req.session.loginUser) {

    // 如果当前房间存在则添加
    // 否则提示当前房间已存在
    // 操作数据库的过程中遇到错误则返回错误信息给前端
    room.findOne({
      name: req.body.name,
    }, (err, val) => {
      if (err) {
        res.send({
          msgCode: 500,
          msgCtx: err,
        })
      }
      else if (val !== null) {
        res.send({
          msgCode: 304,
          msgCtx: 'Room is exist.',
        })
      }
      else {
        name = req.body.name
        desc = req.body.desc || '暂时没有简介。'
        roomSave = new room({
          name: name,
          desc: desc,
        })
        roomSave.save()
        res.send({
          msgCode:200,
          msgCtx: 'Room add success.',
        })
      }
    })
  }
  else {
    res.send({
      msgCode:401,
      msgCtx: 'You cannot access the api. Please login.',
    })
  }
})

// 请求房间聊天记录
router.get('/api/room/mess/:id', (req, res, next) => {

  // 如果有这个房间则继续请求房间的聊天记录
  // 否则提示当前房间不存在
  room.findOne({
    name: req.params.id,
  }, (err, val) => {
    if (val !== null) {

      // 如果查询到当前房间的聊天记录则返回
      // 否则提示未查询到消息
      mess.find({
        room: req.params.id,
      }, (errChild, valChild) => {
        if (val !== null) {
          res.send({
            msgCode:200,
            msgCtx: valChild,
          })
        }
        else {
          res.send({
            msgCode:404,
            msgCtx: 'Has not found any mess.',
          })
        }
      })
    }
    else {
      res.send({
        msgCode:404,
        msgCtx: 'This room is not exist.',
      })
    }
  })
})

module.exports = router
