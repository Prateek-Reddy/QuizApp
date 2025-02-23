const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Get user profile
router.get('/profile/:userId', authMiddleware, (req, res) => {
  userController.getProfile(req, res);
});

// Update user profile (including role) - Admin only
router.put('/profile/:userId', authMiddleware, checkAdmin, (req, res) => {
  userController.updateProfile(req, res);
});

module.exports = router;