const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const authMiddleware = require('../middleware/authMiddleware');

// Start a new quiz attempt
router.post('/start', authMiddleware, (req, res) => {
  attemptController.startAttempt(req, res);
});

// Submit a quiz attempt
router.post('/submit', authMiddleware, (req, res) => {
  attemptController.submitAttempt(req, res);
});

// Get attempt details
router.get('/:attemptId', authMiddleware, (req, res) => {
  attemptController.getAttemptDetails(req, res);
});

module.exports = router;