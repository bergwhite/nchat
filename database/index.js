var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodejsChat');
var Schema = mongoose.Schema;
var userSche = new Schema({
  name: String,
  pass: String
});
var roomSche = new Schema({
  name: String,
  desc: String
});
var messSche = new Schema({
  room: String,
  user: String,
  mess: String,
  time: String
});
exports.user = db.model('users', userSche);
exports.room = db.model('rooms', roomSche);
exports.mess = db.model('messs', messSche);