const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Member = require('../models/member')

// 註冊表單提交
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body

    // 檢查用戶名和電子郵件是否已存在
    const existingMember = await Member.findOne({
      $or: [{ username }, { email }],
    })
    if (existingMember) {
      return res.status(400).json({ error: 'Username or email already exists' })
    }

    // 使用 bcrypt 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    // 創建新的會員
    const newMember = new Member({
      username,
      password: hashedPassword,
      email,
    })

    // 儲存會員到資料庫
    await newMember.save()

    res.status(201).json({ message: 'Registration successful' })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

module.exports = router
