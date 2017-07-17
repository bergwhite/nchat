const Schema = require('./base')

const roomScheme = new Schema({
  name: String,
  desc: String
});

module.exports = roomScheme
