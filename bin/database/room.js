var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSche = new Schema({
  name: String,
  desc: String
});

module.exports = roomSche