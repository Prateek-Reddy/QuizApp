const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const authMiddleware = require('../middleware/authMiddleware');

// Save a response
router.post('/save', authMiddleware, (req, res) => {
  responseController.saveResponse(req, res);
});

// Get all responses for an attempt
router.get('/:attemptId', authMiddleware, (req, res) => {
  responseController.getResponses(req, res);
});

module.exports = router;