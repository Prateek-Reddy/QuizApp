const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Create a new user with a specific role (Admin only)
router.post('/create', authMiddleware, checkAdmin, (req, res) => {
  adminController.createUser(req, res);
});

module.exports = router;