// controllers/questionController.js

const mongoose = require('mongoose')
const Question = require('../models/question')

// 新增題目到資料庫
const addQuestion = async (req, res) => {
  try {
    let data = req.body

    if (!Array.isArray(data)) {
      data = [data] // 如果不是陣列，將其轉換成陣列
    }

    // 使用 Promise.all 可以同時處理多筆新增
    const promises = data.map(async (questionData) => {
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
      } = questionData

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
    })

    await Promise.all(promises)

    res.redirect('/question')
  } catch (error) {
    res.status(500).send('Error adding question(s).')
  }
}

//取得所有題目
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).lean()

    // 檢查請求的 Accept 頭部是否包含 "application/json"
    const isJSONRequest = req.accepts('json')

    if (isJSONRequest) {
      // 如果是 JSON 請求，返回 JSON 格式的數據
      res.json(questions)
    } else {
      // 否則，渲染視圖並返回 HTML 結果
      res.render('question/questionList', { questions })
    }
  } catch (error) {
    res.status(500).send('Error fetching questions.')
  }
}

//questionController.js

// 修改題目
const updateQuestion = async (req, res) => {
  try {
    const { number } = req.params // 將 id 更名為 number
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

    // 找到對應的題目資料並更新，並將 new: true 選項設置為返回更新後的資料
    const updatedQuestion = await Question.findOneAndUpdate(
      { number }, // 使用新的 number 字段
      {
        grade,
        category,
        difficulty,
        tags,
        questionText,
        correctAnswer,
        options,
        createdBy,
      },
      { new: true } // 設置 new: true 以返回更新後的資料
    )

    res.json(updatedQuestion) // 將更新後的資料以 JSON 格式返回
  } catch (error) {
    res.status(500).send('Error updating question.')
  }
}

const deleteQuestion = async (req, res) => {
  try {
    const { numbers } = req.body

    // 檢查 numbers 是否為陣列
    if (!Array.isArray(numbers)) {
      return res
        .status(400)
        .send('Invalid request. "numbers" must be an array.')
    }

    // 檢查 numbers 是否都為有效的數字
    if (!numbers.every((num) => Number.isInteger(num))) {
      return res
        .status(400)
        .send('Invalid request. All elements in "numbers" must be integers.')
    }

    // 將 numbers 轉換為整數後進行刪除操作
    const deletedQuestions = await Question.deleteMany({
      number: { $in: numbers },
    })

    if (deletedQuestions.deletedCount === 0) {
      return res.status(404).send('No matching question found.')
    }

    res.json({
      message: 'Questions deleted successfully.',
      deletedCount: deletedQuestions.deletedCount,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error deleting questions.')
  }
}

// 取得指定類別、難度的題目
const getQuestionsByCategoryAndDifficulty = async (req, res) => {
  try {
    const { category, difficulty, count } = req.body // 修改為使用 req.body

    // 檢查輸入的 count 是否為合法數字
    const numCount = parseInt(count, 10)
    if (isNaN(numCount) || numCount <= 0) {
      return res.status(400).send('Invalid count')
    }

    // 使用 find 方法查詢符合條件的題目
    const questions = await Question.find({ category, difficulty })
      .limit(numCount) // 限制回傳的題數
      .select('questionText options correctAnswer') // 只選取指定欄位
      .lean() // 將查詢結果轉換為純 JavaScript 物件

    // 檢查是否有符合條件的題目
    if (questions.length === 0) {
      return res.status(404).send('No questions found.')
    }

    // 將回傳的資料包裝成規定的格式
    const responseData = {
      questions: questions.map((question) => ({
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
      })),
    }

    res.json(responseData)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error fetching questions.')
  }
}

// 導出 CRUD 方法
module.exports = {
  addQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategoryAndDifficulty,
}
