const express = require('express')
const router = express.Router()
const UserModel = require('../api/UserLoginAPI/users/users.model.js')
const UserTool = require('../api/UserLoginAPI/users/users.tool.js')
const Activity = require('../api/UserLoginAPI/activity/activity.model.js')

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body
    console.log(req.body)

    // 檢查必要參數
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Invalid parameters' })
    }

    // 檢查使用者名稱、電子郵件格式
    if (!UserTool.validateUsername(username)) {
      return res.status(400).json({ error: 'Invalid username' })
    }

    if (!UserTool.validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    // 檢查密碼格式
    if (!UserTool.validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    // 檢查使用者名稱和電子郵件是否已存在
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' })
      } else if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' })
      }
    }

    // 建立新使用者
    const newUser = new UserModel({
      username,
      password: UserTool.hashPassword(password),
      email,
      avatar: '',
      permission_level: 1,
      validation_level: 0,
      account_create_time: new Date(),
      last_login_time: new Date(),
      email_confirm_key: UserTool.generateID(20),
    })

    await newUser.save()

    // Activity Log
    const activityData = {
      username: newUser.username,
      email: newUser.email,
    }
    const activity = new Activity({
      type: 'register',
      username: newUser.username,
      data: activityData,
    })
    await activity.save()

    res.status(200).json({ message: '註冊成功' })
  } catch (error) {
    console.error('註冊失敗：', error)
    res.status(500).json({ error: '註冊失敗' })
  }
}

router.post('/register', register)

module.exports = router
