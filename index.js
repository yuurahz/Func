require('dotenv').config()
const Converter = new (require('./src/converter'))
const Function = new (require('./src/functions'))
const Scraper = new (require('./src/scraper'))
module.exports = class Component {
   Converter = Converter
   Function = Function
   Scraper = Scraper
}
