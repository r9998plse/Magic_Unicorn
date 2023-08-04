const express = require('express')
const app = express()
const port = process.env.PORT || 3001 // 使用自訂端口，或者讀取環境變數中的端口
const host = '0.0.0.0' // 監聽主機

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
  'mongodb+srv://MagicUniorn:zJ9h8ATeYtixGy4L@magicunicorn.zdqkjq3.mongodb.net/'
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

// 引入 questionController
const questionController = require('./controllers/questionController')

// 新增題目的表單頁面
app.get('/question/add', (req, res) => {
  res.render('addQuestion')
})

// 新增題目的表單提交處理
app.post('/question', questionController.addQuestion)

// 顯示所有題目
app.get('/question', questionController.getAllQuestions)

// 編輯題目的表單頁面
app.get('/question/edit/:id', async (req, res) => {
  try {
    const { id } = req.params
    const question = await questionController.getQuestionById(id)
    res.render('editQuestion', { question })
  } catch (error) {
    res.status(500).send('Error fetching question.')
  }
})

// 編輯題目的表單提交處理
app.put('/question/edit/:number', questionController.updateQuestion)

// 刪除題目 (單筆或多筆)
app.delete('/question', questionController.deleteQuestion)

// 取得指定類別、難度的題目
app.post(
  '/question/getByCategoryAndDifficulty',
  questionController.getQuestionsByCategoryAndDifficulty
)

/*----Question DB--------------------------------------------------------*/

/*----VocabularyDB--------------------------------------------------------*/

// 引入 vocabularyController
const vocabularyController = require('./controllers/vocabularyController')

// 新增單字的表單頁面
app.get('/vocabulary/add', (req, res) => {
  res.render('addVocabulary')
})

// 新增單字的表單提交處理
app.post('/vocabulary', vocabularyController.addVocabulary)

// 顯示所有單字
app.get('/vocabulary', vocabularyController.getAllVocabulary)

// 更新單字的表單頁面
app.get('/vocabulary/edit/:number', async (req, res) => {
  try {
    const { number } = req.params
    const vocabulary = await vocabularyController.getVocabularyByNumber(number)
    res.render('editVocabulary', { vocabulary })
  } catch (error) {
    res.status(500).send('Error fetching vocabulary.')
  }
})

// 更新單字的表單提交處理
app.put('/vocabulary/:number', vocabularyController.updateVocabulary)

// 刪除單字 (單筆或多筆)
app.delete('/vocabulary', vocabularyController.deleteVocabulary)

// 更新所有資料的版本號
app.put('/vocabulary/updateAllVersions', vocabularyController.updateAllVersions)

/*----VocabularyDB--------------------------------------------------------*/

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
httpServer.listen(port, host, () => {
  console.log('HTTP server listening on port ', port)
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
