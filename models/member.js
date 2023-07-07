const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // 其他會員資料欄位...
})

// const Member = mongoose.model('Member', memberSchema)

const Member = mongoose.model('Member', memberSchema) // 指定 collection 名稱為 "MAGIC_UNICORN"

module.exports = Member
