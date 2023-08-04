const express = require('express')
const app = express()
const port = process.env.PORT || 3001 // 使用自訂端口，或者讀取環境變數中的端口
const host = '0.0.0.0' // 監聽主機

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

/*----UserLoginAPI--------------------------------------------------------*/

const fs = require('fs')
const http = require('http')
const https = require('https')
const config = require('./api/UserLoginAPI/config.js')
const Limiter = require('./api/UserLoginAPI/tools/limiter.tool')

//Limiter to prevent attacks
Limiter.limit(app)

//Headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  res.header('Access-Control-Expose-Headers', 'Content-Length')
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  )
  if (req.method === 'OPTIONS') {
    return res.send(200)
  } else {
    return next()
  }
})

// 引入 body-parser 中間件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Parse JSON body
app.use(express.json({ limit: '100kb' }))

const session = require('express-session')

app.use(
  session({
    secret: 'admin',
    resave: false,
    saveUninitialized: false,
  })
)

//Log request
app.use((req, res, next) => {
  var today = new Date()
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  var date_tag = '[' + date + ' ' + time + ']'
  console.log(date_tag + ' ' + req.method + ' ' + req.originalUrl)
  next()
})

//Route root DIR
app.get('/', function (req, res) {
  res.status(200).send(config.api_title + ' ' + config.version)
})

//Public folder
app.use('/', express.static('public'))

//Routing
const AuthorizationRouter = require('./api/UserLoginAPI/authorization/auth.routes')
AuthorizationRouter.route(app)

const UsersRouter = require('./api/UserLoginAPI/users/users.routes')
UsersRouter.route(app)

const ActivityRouter = require('./api/UserLoginAPI/activity/activity.routes')
ActivityRouter.route(app)

/*----UserLoginAPI--------------------------------------------------------*/

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

// Start the server
const httpServer = http.createServer(app)
httpServer.listen(port, host, () => {
  console.log('HTTP server listening on port ', port)
})

//HTTPS
if (config.allow_https && fs.existsSync(config.https_key)) {
  var privateKey = fs.readFileSync(config.https_key, 'utf8')
  var certificate = fs.readFileSync(config.https_cert, 'utf8')
  var cert_authority = fs.readFileSync(config.https_ca, 'utf8')
  var credentials = { key: privateKey, cert: certificate, ca: cert_authority }
  var httpsServer = https.createServer(credentials, app)
  httpsServer.listen(config.port_https, function () {
    console.log('HTTPS server listening on port ', config.port_https)
  })
}

//Start jobs
const Jobs = require('./api/UserLoginAPI/jobs/jobs.js')
Jobs.InitJobs()
