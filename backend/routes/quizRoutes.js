const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Create a new quiz (Admin only)
router.post('/create', authMiddleware, checkAdmin, (req, res) => {
  quizController.createQuiz(req, res);
});

// List all quizzes
router.get('/list', authMiddleware, (req, res) => {
  quizController.getQuizzes(req, res);
});

// Get a specific quiz by ID
router.get('/:quizId', authMiddleware, (req, res) => {
  quizController.getQuizById(req, res);
});

// Delete a quiz (Admin only)
router.delete('/:quizId', authMiddleware, checkAdmin, (req, res) => {
  quizController.deleteQuiz(req, res);
});

// Auto-create quizzes (Admin only)
router.post('/auto-create', authMiddleware, checkAdmin, quizController.autoCreateQuizzes);

module.exports = router;