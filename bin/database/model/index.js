var db = require('../connect')
var dbScheme = require('../scheme')

var allModel = {
  user: db.model('users', dbScheme.userScheme),
  info: db.model('infos', dbScheme.infoScheme),
  room: db.model('rooms', dbScheme.roomScheme),
  mess: db.model('messes', dbScheme.messScheme)
}

module.exports = allModel