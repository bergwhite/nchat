const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const list = {
  server: server,
  io: io
}

module.exports = list
