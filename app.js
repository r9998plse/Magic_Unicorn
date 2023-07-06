const express = require('express')
const app = express()
const port = 3000

// setting static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(port, () => {
  console.log('Example app is listening on port :' + port)
})
