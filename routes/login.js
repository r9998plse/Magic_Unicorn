const express = require('express')
const router = express.Router()
const UserModel = require('../api/UserLoginAPI/users/users.model.js').UserModel
const UserTool = require('../api/UserLoginAPI/users/users.tool.js')

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 檢查必要參數
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid parameters' })
    }

    // 檢查使用者名稱和密碼是否正確
    const user = await UserModel.findOne({ username })

    if (!user || !UserTool.comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // 登入成功
    // 在這裡可以進行額外的處理，例如建立授權令牌或設置 session
    console.log('登入成功：', username)
    res.redirect('/success')

    res.status(200).json({ message: '登入成功' })
  } catch (error) {
    console.error('登入失敗：', error)
    res.status(500).json({ error: '登入失敗' })
  }
}

router.post('/', login)

module.exports = router
