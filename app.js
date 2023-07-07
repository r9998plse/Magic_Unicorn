const express = require('express')
const exphbs = require('express-handlebars') //引入樣板引擎 - handlebars
const helpers = require('handlebars-helpers')()

const app = express()

// handlebars setting
const hbs = exphbs.create()

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000)
