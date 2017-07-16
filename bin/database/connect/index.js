const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/nodejsChat');

module.exports = db