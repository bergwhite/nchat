var Schema = require('./base')

var roomScheme = new Schema({
  name: String,
  desc: String
});

module.exports = roomScheme