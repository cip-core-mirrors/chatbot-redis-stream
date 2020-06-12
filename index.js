const redis = require('redis')

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT || 6379
const password = process.env.REDIS_PASSWORD

const config = {
  host: host,
  port: port,
}

if (password) {
  config.auth_pass = password
}

const client = redis.createClient(config)

client.on('connect', function() {
  console.log('Connected !')
})
