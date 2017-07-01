const chatData = require('./data')
const chatMethod = require('./method')
const chatEvent = require('./event')
const port = 8089

chatEvent(chatData, chatMethod, port)

module.exports = chatEvent