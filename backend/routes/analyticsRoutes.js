const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Get quiz performance analytics (Admin only)
router.get('/quiz-performance', authMiddleware, checkAdmin, (req, res) => {
  analyticsController.getQuizPerformance(req, res);
});

// Get user performance analytics (Admin only)
router.get('/user-performance', authMiddleware, checkAdmin, (req, res) => {
  analyticsController.getUserPerformance(req, res);
});

module.exports = router;