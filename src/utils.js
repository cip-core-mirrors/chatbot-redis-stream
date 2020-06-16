const redis = require('redis')

const config = require('../config.js')

const host = config.REDIS_HOST
const port = config.REDIS_PORT
const password = config.REDIS_PASSWORD

const connectionConfig = {
  url: `redis://${password ? (':' + password + '@') : ''}${host}/0`,
  no_ready_check: true,
  port: port,
}

if (password) {
  connectionConfig.auth_pass = password
}

const client = redis.createClient(connectionConfig)

async function ping() {
  return await client.ping()
}

client.on('connect', function() {
  console.log('Connected !')
})

module.exports = {
  ping,
}