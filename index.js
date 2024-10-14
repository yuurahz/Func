require('dotenv').config()
const Converter = new (require('./src/converter'))
const Function = new (require('./src/functions'))
const Scraper = new (require('./src/scraper'))
const Levelling = require('./src/levelling')
const CloudDBAdapter = require('./src/cloudDBAdapter')
module.exports = class Component {
   CloudDBAdapter = CloudDBAdapter
   Converter = Converter
   Function = Function
   levelling = Levelling
   Scraper = Scraper
}