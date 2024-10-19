require('dotenv')

const URL = process.env.NODE_ENV === 'development' 
  ? process.env.TEST_URI
  : process.env.URI

const PORT = process.env.PORT

module.exports = {
  URL,
  PORT
}