var userScheme = require('./user.js')
var infoScheme = require('./info.js')
var roomScheme = require('./room.js')
var messScheme = require('./mess.js')

var allScheme = {
  userScheme: userScheme,
  infoScheme: infoScheme,
  roomScheme: roomScheme,
  messScheme: messScheme
}

module.exports = allScheme