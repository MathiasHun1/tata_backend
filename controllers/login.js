const { response } = require('express')

const loginRouter = require('express').Router()
require('dotenv').config()

loginRouter.post('/', (req, res, next) => {
    const { password } = req.body
    if (password === process.env.LOGINPASS) {
        return res.status(200).end()
    }
    return res.status(401).json({error: 'wrong password'})
})

module.exports = loginRouter