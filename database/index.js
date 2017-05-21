var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/ndoejsChat');
var Schema = mongoose.Schema;
var userSche = new Schema({
  name: String,
  pass: String
});
exports.user = db.model('user', userSche);