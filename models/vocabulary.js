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

// 新增靜態方法 findLatestVersion
vocabularySchema.statics.findLatestVersion = async function () {
  try {
    const latestVocabulary = await this.findOne().sort({ version: -1 }).exec()

    if (latestVocabulary) {
      const lastVersion = latestVocabulary.version
      const versionNumber = parseInt(lastVersion.split('.')[1])
      const newVersion = `Ver.${versionNumber + 1}`
      return newVersion
    } else {
      return 'Ver.0'
    }
  } catch (error) {
    throw new Error('Error finding latest version.')
  }
}

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema)

module.exports = Vocabulary
