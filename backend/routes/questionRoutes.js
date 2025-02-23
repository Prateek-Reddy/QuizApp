const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Add a new question (Admin only)
router.post('/add', authMiddleware, checkAdmin, (req, res) => {
  questionController.addQuestion(req, res);
});

// List all questions
router.get('/list', authMiddleware, (req, res) => {
  questionController.getQuestions(req, res);
});

// Update a question (Admin only)
router.put('/:questionId', authMiddleware, checkAdmin, (req, res) => {
  questionController.updateQuestion(req, res);
});

// Delete a question (Admin only)
router.delete('/:questionId', authMiddleware, checkAdmin, (req, res) => {
  questionController.deleteQuestion(req, res);
});

module.exports = router;