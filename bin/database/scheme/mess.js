var Schema = require('./base')

var messScheme = new Schema({
  room: String,
  user: String,
  mess: String,
  time: Number,
  img: String
});

module.exports = messScheme