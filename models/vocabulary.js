const mongoose = require('mongoose')
const { Schema } = mongoose

const vocabularySchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  tags: [String],
  english: {
    type: String,
    required: true,
  },
  chinese: {
    type: String,
    required: true,
  },
  exampleSentences: [String],
  partOfSpeech: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
    default: 'Ver.0',
  },
})

// 添加靜態方法 findLatestVersion 到 Vocabulary 模型
vocabularySchema.statics.findLatestVersion = async function () {
  try {
    const latestVocabulary = await this.findOne({}, 'version')
      .sort({ version: -1 })
      .lean()
    return latestVocabulary ? latestVocabulary.version : 'Ver.0'
  } catch (error) {
    console.error('Error finding latest version:', error)
    throw error
  }
}

// 設置 version 屬性的預設值為 "Ver.0"
vocabularySchema.pre('save', function (next) {
  if (!this.version) {
    this.version = 'Ver.0'
  }
  next()
})

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema)

module.exports = Vocabulary
