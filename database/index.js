var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/ndoejsChat');
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
exports.user = db.model('user', userSche);
exports.room = db.model('room', roomSche);
exports.mess = db.model('mess', messSche);
console.log(userSche);