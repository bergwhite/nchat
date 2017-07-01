var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSche = new Schema({
  user: String,
  gender: String,
  img: String,
  city: String,
  hobbies: Array
});

module.exports = infoSche