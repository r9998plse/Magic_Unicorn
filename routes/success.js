const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const { username } = req.session
  res.render('success', { username })
})

module.exports = router
