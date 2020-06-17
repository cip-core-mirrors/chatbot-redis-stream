const express = require('express')

const utils = require('./utils')

const router = express.Router()

router.get('/PING', ping)

router.get('/events/:hash', getEvent)
router.post('/events', pushEvent)

async function ping(req, res, next) {
    try {
        await res.json(await utils.ping())
    } catch (e) {
        console.error(e)
        next(e)
    }
}

async function getEvent(req, res, next) {
    try {
        const hash = req.params['hash']
        await res.json(await utils.getEvent(hash))
    } catch (e) {
        console.error(e)
        next(e)
    }
}

async function pushEvent(req, res, next) {
    const { project, username } = req.body

    try {
        const fields = {
            project,
            username,
        }
        const hash = await utils.getUniqueHash()
        await utils.createHash(hash, fields)
        await utils.pushPendingEvent(hash)
        await res.json({ hash: fields })
    } catch (e) {
        console.error(e)
        next(e)
    }
}

module.exports = router