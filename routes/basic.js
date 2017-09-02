const express = require('express');
const router = express.Router();
const {jwtDec} = require('../bin/jwt');

const conf = {
  express: express,
  router: router,
  jwtDec: jwtDec,
}

module.exports = conf
