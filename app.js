const express = require('express')

const app = express()

// handlebars setting
const exphbs = require('express-handlebars') //引入樣板引擎 - handlebars
const helpers = require('handlebars-helpers')()
const hbs = exphbs.create()

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// 資料庫連接
const mongoose = require('mongoose')
const mongoURI =
  'mongodb+srv://blank100071:Vurlqhkg9P9qFwxL@mytestmongodb.akhlroc.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'MAGIC_UNICORN' // 設定要使用的 database 名稱

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName, // 指定要使用的 database
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

// 引入 body-parser 中間件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setting static files
app.use(express.static('public'))

//路由設定

// 註冊頁面------------------------------------------------------
const registerRouter = require('./routes/register')

app.use('/api', registerRouter)

app.get('/register', (req, res) => {
  res.render('register')
})
// ---------------------------------------------------------------

app.get('/', (req, res) => {
  // res.render('index', render_index.blank)
})

app.listen(3000)
