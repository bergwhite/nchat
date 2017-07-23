const chatData = require('./data')
const chatMethod = require('./method')
const chatEvent = require('./event')
const port = 9998

chatEvent(chatData, chatMethod, port)

module.exports = chatEvent
