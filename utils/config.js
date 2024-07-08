require('dotenv')

const URL = process.env.NODE_ENV === 'development' 
  ? process.env.TEST_URL
  : process.env.URL

const PORT = process.env.PORT

module.exports = {
  URL,
  PORT
}