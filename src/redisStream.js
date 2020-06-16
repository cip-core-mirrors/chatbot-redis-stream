const express = require('express')

const utils = require('./utils')

const router = express.Router()

router.get('/PING', ping)

async function ping(req, res, next) {
    try {
        await res.json(await utils.ping())
    } catch (e) {
        next(e)
    }
}

module.exports = router