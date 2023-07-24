// controllers/questionController.js

const mongoose = require('mongoose')
const Question = require('../models/question')

// 新增題目到資料庫
const addQuestion = async (req, res) => {
  try {
    const {
      number,
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
      number,
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
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).lean()
    console.log(questions)
    return res.render('question/questionList', { questions })
  } catch (error) {
    return res.status(500).send('Error fetching questions.')
  }
}

// 修改題目
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params // 將 id 更名為 number
    const {
      grade,
      category,
      difficulty,
      tags,
      questionText,
      correctAnswer,
      options,
      createdBy,
    } = req.body

    // 找到對應的題目資料並更新
    await Question.findOneAndUpdate(
      { number: id }, // 使用新的 number 字段
      {
        grade,
        category,
        difficulty,
        tags,
        questionText,
        correctAnswer,
        options,
        createdBy,
      }
    )

    res.redirect('/question')
  } catch (error) {
    res.status(500).send('Error updating question.')
  }
}

// 刪除題目
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    const isValidObjectId = mongoose.Types.ObjectId.isValid(questionId)

    if (!isValidObjectId) {
      throw new Error('Invalid questionId')
    }

    // 轉換 questionId 成 ObjectId 並進行刪除操作
    const question = await Question.findByIdAndDelete(
      mongoose.Types.ObjectId(questionId)
    )

    if (!question) {
      throw new Error('Question not found.')
    }

    res.redirect('/question')
  } catch (error) {
    console.log(error)
    res.status(500).send('Error deleting question.')
  }
}

// 導出 CRUD 方法
module.exports = {
  addQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
}
