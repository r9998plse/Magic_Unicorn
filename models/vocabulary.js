const mongoose = require('mongoose');
const { Schema } = mongoose;

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
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;
