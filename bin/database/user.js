var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSche = new Schema({
  name: String,
  pass: String
});

module.exports = userSche