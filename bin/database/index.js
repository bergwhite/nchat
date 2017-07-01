var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodejsChat');
var userSche = require('./user.js')
var infoSche = require('./info.js')
var roomSche = require('./room.js')
var messSche = require('./mess.js')

var dbModel = {
  user: db.model('users', userSche),
  info: db.model('infos', messSche),
  room: db.model('rooms', roomSche),
  mess: db.model('messes', messSche)
}

module.exports = dbModel