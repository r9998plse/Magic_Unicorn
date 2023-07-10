const express = require('express')
const app = express()

//UserLoginAPI ,
const fs = require('fs')
const http = require('http')
const https = require('https')
const api_user_login = require('./api/UserLoginAPI/server')

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

/*----UserLoginAPI--------------------------------------------------------*/

// Invoke the api_user_login function
api_user_login(app)
app.use('/api', api_user_login)

// 處理會員相關功能

// 引入相關模組和資源

// const loginRouter = require('./routes/login')
// const registerRouter = require('./routes/register')
// ...

// 登入功能
// app.use('/login', loginRouter)

// 註冊功能
// app.use('/register', registerRouter)

// 修改功能
// ...

// 查詢功能
// ...

// 其他會員相關功能
// ...

/*----UserLoginAPI--------------------------------------------------------*/

// 引入 body-parser 中間件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setting static files
app.use(express.static('public'))

// Start the server
const httpServer = http.createServer(app)
httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000')
})

// const options = {
//   key: fs.readFileSync('sslcert/server.key'),
//   cert: fs.readFileSync('sslcert/server.crt'),
// }
// const httpsServer = https.createServer(options, app)
// httpsServer.listen(443, () => {
//   console.log('HTTPS server listening on port 443')
// })
