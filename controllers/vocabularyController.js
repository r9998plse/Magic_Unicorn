const mongoose = require('mongoose')
const Vocabulary = require('../models/vocabulary')

// 新增單字到資料庫
const addVocabulary = async (req, res) => {
  try {
    const data = req.body

    if (Array.isArray(data)) {
      // 如果是多筆資料，使用 insertMany 方法新增
      await Vocabulary.insertMany(data)
    } else {
      // 如果是單筆資料，使用 create 方法新增
      const newVocabulary = new Vocabulary({
        number: data.number,
        grade: data.grade,
        difficulty: data.difficulty,
        tags: data.tags,
        english: data.english,
        chinese: data.chinese,
        exampleSentences: data.exampleSentences,
        partOfSpeech: data.partOfSpeech,
      })

      await newVocabulary.save()
    }

    res.redirect('/vocabulary')
  } catch (error) {
    res.status(500).send('Error adding vocabulary.')
  }
}

// 取得所有單字
const getAllVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({}).lean()

    res.json(vocabulary)
  } catch (error) {
    res.status(500).send('Error fetching vocabulary.')
  }
}

// 更新單字
const updateVocabulary = async (req, res) => {
  try {
    const { number } = req.params
    const data = req.body

    const updatedVocabulary = await Vocabulary.findOneAndUpdate(
      { number },
      {
        grade: data.grade,
        difficulty: data.difficulty,
        tags: data.tags,
        english: data.english,
        chinese: data.chinese,
        exampleSentences: data.exampleSentences,
        partOfSpeech: data.partOfSpeech,
      },
      { new: true }
    )

    res.json(updatedVocabulary)
  } catch (error) {
    res.status(500).send('Error updating vocabulary.')
  }
}

//刪除單字
const deleteVocabulary = async (req, res) => {
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
    const deletedVocabularies = await Vocabulary.deleteMany({
      number: { $in: numbers },
    })

    if (deletedVocabularies.deletedCount === 0) {
      return res.status(404).send('No matching vocabulary found.')
    }

    res.json({
      message: 'Vocabularies deleted successfully.',
      deletedCount: deletedVocabularies.deletedCount,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error deleting vocabularies.')
  }
}

//更新版本號
const updateAllVersions = async (req, res) => {
  try {
    const latestVersion = await Vocabulary.findLatestVersion()
    console.log('Latest version:', latestVersion) // 添加除錯日誌
    const updatedVocabularies = await Vocabulary.updateMany(
      {},
      { version: latestVersion }
    )

    res.json({
      message: 'All versions updated successfully.',
      updatedCount: updatedVocabularies.nModified,
    })
  } catch (error) {
    console.error('Error updating versions:', error) // 添加除錯日誌
    res.status(500).send('Error updating versions.')
  }
}

// 導出 CRUD 方法
module.exports = {
  addVocabulary,
  getAllVocabulary,
  updateVocabulary,
  deleteVocabulary,
  updateAllVersions,
}
