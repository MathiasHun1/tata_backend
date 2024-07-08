const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const daysRouter = require('./controllers/days')
const middleware = require('./utils/middleware')
const path = require('path')
const mongoose = require('mongoose')
// const morgan = require('morgan')

// morgan.token('content', function getContent (req) {
//   return JSON.stringify(req.body) 
// })

const frontend = path.join(__dirname, 'dist')

logger.info('Connecting to MongoDB')

mongoose.connect(config.URL)
  .then(response =>logger.info('Connected to MongoDB'))
  .catch(error => logger.info(error.errorResponse.errmsg))

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use(express.static('dist'))
app.use('/api/openings', daysRouter)
app.use('*', express.static(frontend))
// app.use(middleware.errorhandler)


module.exports = app