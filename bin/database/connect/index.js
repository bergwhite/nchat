var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodejsChat');

module.exports = db