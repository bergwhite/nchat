const db = require('../connect')
const dbScheme = require('../scheme')

const allModel = {
  user: db.model('users', dbScheme.userScheme),
  info: db.model('infos', dbScheme.infoScheme),
  room: db.model('rooms', dbScheme.roomScheme),
  mess: db.model('messes', dbScheme.messScheme)
}

module.exports = allModel