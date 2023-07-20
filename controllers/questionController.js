// questionController.js

const mongoose = require('mongoose')
const Question = require('../models/question')

// 新增題目到資料庫
const addQuestion = async (req, res) => {
  try {
    const {
      id,
      grade,
      category,
      difficulty,
      tags,
      questionText,
      correctAnswer,
      createdBy,
      options,
    } = req.body

    const newQuestion = new Question({
      id,
      grade,
      category,
      difficulty,
      tags,
      questionText,
      correctAnswer,
      createdBy,
      options,
    })

    await newQuestion.save()
    res.redirect('/question')
  } catch (error) {
    res.status(500).send('Error adding question.')
  }
}

// 取得所有題目
const getAllQuestions = async () => {
  try {
    const questions = await Question.find({})

    console.log(questions)

    return questions.map((question) => question.toObject())
  } catch (error) {
    throw new Error('Error fetching questions.')
  }
}

// 導出 CRUD 方法
module.exports = {
  addQuestion,
  getAllQuestions,
}
