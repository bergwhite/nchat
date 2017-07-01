var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messSche = new Schema({
  room: String,
  user: String,
  mess: String,
  time: Number,
  img: String
});

module.exports = messSche