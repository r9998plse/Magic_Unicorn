const express = require('express')
const router = express.Router()
const usersTool = require('../api/UserLoginAPI/users/users.tool')

// 重設密碼頁面
router.get('/', (req, res) => {
  res.render('passwordReset')
})

// 重設密碼請求
router.post('/', (req, res) => {
  const email = req.body.email
  // 執行相應的邏輯，例如生成重設密碼碼、寄送郵件等
  usersTool.sendPasswordResetEmail(email, function (result) {
    if (result) {
      // 寄信成功，導向成功頁面
      res.render('passwordResetSuccess')
    } else {
      // 寄信失敗，導向錯誤頁面或顯示錯誤訊息
      res.render('passwordReset', {
        error: 'Failed to send password reset email.',
      })
    }
  })
})

module.exports = router
