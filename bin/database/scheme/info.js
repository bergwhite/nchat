const Schema = require('./base')

const infoScheme = new Schema({
  user: String,
  gender: String,
  img: String,
  city: String,
  hobbies: Array
});

module.exports = infoScheme