var Schema = require('./base')

var userScheme = new Schema({
  name: String,
  pass: String
});

module.exports = userScheme