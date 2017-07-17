const Schema = require('./base')

const messScheme = new Schema({
  room: String,
  user: String,
  mess: String,
  time: Number,
  img: String
});

module.exports = messScheme
