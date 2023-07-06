const express = require('express')
const app = express()

const port = 5050

app.get('/', (req, res) => {
  res.send('welcome to index page')
})

// app.listen(5050, () => {
//   console.log('SERVER is listening port 3000....')
// })

app.listen(port, () => {
  console.log('Express is running on http://localhost:' + port)
})
