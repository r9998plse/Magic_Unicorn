const express = require('express')
const app = express()

//UserLoginAPI
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

// 引入 Question 模型
const Question = require('./models/question')

// 引入 body-parser 中間件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const session = require('express-session')

app.use(
  session({
    secret: 'admin',
    resave: false,
    saveUninitialized: false,
  })
)

/*----UserLoginAPI--------------------------------------------------------*/

// Invoke the api_user_login function
api_user_login(app)
app.use('/api', api_user_login)

// 處理會員相關功能

// 引入相關模組和資源

const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')

const passwordResetRouter = require('./routes/passwordReset')

// 登入功能
app.use('/login', loginRouter)

// 登入頁面
app.get('/login', (req, res) => {
  res.render('login')
})

// 註冊功能
app.use('/register', registerRouter)

// Register路由設定
const usersRoutes = require('./api/UserLoginAPI/users/users.routes')
usersRoutes.route(app)

// 註冊頁面
app.get('/register', (req, res) => {
  res.render('register')
})

// 忘記密碼功能
app.use('/password/reset', passwordResetRouter)

// 修改功能
// ...

// 查詢功能
// ...

// 其他會員相關功能
// ...

/*----UserLoginAPI--------------------------------------------------------*/

// setting static files
app.use(express.static('public'))

// Start the server
const httpServer = http.createServer(app)
httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000')
})

//以下為 https 設定

// const options = {
//   key: fs.readFileSync('sslcert/server.key'),
//   cert: fs.readFileSync('sslcert/server.crt'),
// }
// const httpsServer = https.createServer(options, app)
// httpsServer.listen(443, () => {
//   console.log('HTTPS server listening on port 443')
// })
