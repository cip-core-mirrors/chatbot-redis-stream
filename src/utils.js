const redis = require('redis')
const { promisify } = require('util')

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
const pingAsync = promisify(client.ping).bind(client)
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

async function ping() {
  return await pingAsync()
}

async function get(key) {
  return await getAsync(key)
}

async function set(args) {
  return await setAsync(args)
}

client.on('connect', function() {
  console.log('Connected !')
})

module.exports = {
  ping,
  get,
  set,
}