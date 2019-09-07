'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  api: '"http://personal.mekeai.com/api"'
  // api: '"http://192.168.1.192:9001/api"'
})
