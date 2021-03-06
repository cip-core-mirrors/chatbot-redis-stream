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

// Make functions asynchronous
const pingAsync = promisify(client.ping).bind(client)
const hGetAllAsync = promisify(client.hgetall).bind(client)
const hSetAsync = promisify(client.hset).bind(client)
const hIncryByAsync = promisify(client.hincrby).bind(client)
const lpushAsync = promisify(client.lpush).bind(client)
const rpoplpushAsync = promisify(client.rpoplpush).bind(client)

async function ping() {
  return await pingAsync()
}

async function getUniqueHash() {
  return await hIncryByAsync('unique_incr', 'index', 1)
}

async function createHash(hash, fields) {
  const args = Object.entries(fields).reduce((acc, value) => {
    acc.push(...value)
    return acc
  }, [])

  return await hSetAsync(hash, args)
}

async function pushPendingEvent(hash) {
  return await lpushAsync('pending', hash)
}

async function popPendingEvent() {
  return await rpoplpushAsync('pending', 'processing')
}

async function getEvent(hash) {
  return await hGetAllAsync(hash)
}

client.on('connect', function() {
  console.log('Connected !')
})

module.exports = {
  ping,
  getEvent,
  getUniqueHash,
  createHash,
  pushPendingEvent,
  popPendingEvent,
}