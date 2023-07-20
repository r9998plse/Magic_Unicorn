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
const hbs = exphbs.create({
  // 設定允許使用原型方法和屬性
  allowProtoMethodsByDefault: true,
  allowProtoPropertiesByDefault: true,
  // 設定為 false 可以禁用警告訊息
  allowProtoMethods: true,
  allowProtoProperties: true,
})

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

const session = require('express-session')

app.use(
  session({
    secret: 'admin',
    resave: false,
    saveUninitialized: false,
  })
)

/*----Question DB--------------------------------------------------------*/

// 引入 questionController 函式庫
const questionController = require('./controllers/questionController')

// 其他的設定和路由處理等...

// 顯示新增題目的表單頁面
app.get('/question/add', (req, res) => {
  res.render('question/addQuestion')
})
// 處理新增題目的表單提交，使用 questionController 中的 addQuestion 函式
app.post('/question', questionController.addQuestion)

// 顯示題目清單頁面
app.get('/question', async (req, res) => {
  try {
    // 使用 questionController 的 getAllQuestions 方法取得所有題目
    const questions = await questionController.getAllQuestions()

    res.render('question/questionList', { questions })
  } catch (error) {
    res.status(500).send('Error fetching questions.')
  }
})

/*----Question DB--------------------------------------------------------*/

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
