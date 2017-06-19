var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodejsChat');
var Schema = mongoose.Schema;
var userSche = new Schema({
  name: String,
  pass: String
});
var infoSche = new Schema({
  user: String,
  gender: String,
  img: String,
  city: String,
  hobbies: Array
});
var roomSche = new Schema({
  name: String,
  desc: String
});
var messSche = new Schema({
  room: String,
  user: String,
  mess: String,
  time: Number,
  img: String
});
exports.user = db.model('users', userSche);
exports.info = db.model('infos', messSche);
exports.room = db.model('rooms', roomSche);
exports.mess = db.model('messes', messSche);