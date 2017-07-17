const Schema = require('./base')

const userScheme = new Schema({
  name: String,
  pass: String
});

module.exports = userScheme
