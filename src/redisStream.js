const express = require('express')

const utils = require('./utils')

const router = express.Router()

router.get('/PING', ping)
router.get('/GET/:key', get)
router.get('/SET/:key/:value', set)

async function ping(req, res, next) {
    try {
        await res.json(await utils.ping())
    } catch (e) {
        next(e)
    }
}

async function get(req, res, next) {
    try {
        const key = req.params['key']
        await res.json(await utils.get(key))
    } catch (e) {
        next(e)
    }
}

async function set(req, res, next) {
    try {
        const key = req.params['key']
        const value = req.params['value']
        await res.json(await utils.set([key, value]))
    } catch (e) {
        next(e)
    }
}

module.exports = router