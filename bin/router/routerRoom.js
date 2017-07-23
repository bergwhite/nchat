const {router} = require('./base')
const {room, mess} = require('../database/model')

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
