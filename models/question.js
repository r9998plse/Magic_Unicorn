// models/question.js

const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  grade: { type: String, required: true },
  questionType: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: { type: [String], required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdBy: { type: String, required: true },
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question
