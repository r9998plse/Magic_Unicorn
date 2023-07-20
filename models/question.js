// models/question.js

const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  grade: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: { type: [String], required: true },
  questionText: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  options: { type: [String], required: true },
  createdBy: { type: String, required: true },
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question
