const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateEmail, validatePassword, validateRole } = require('../utils/validators');

// User registration
router.post('/register', (req, res) => {
  const { email, password, role = 'student' } = req.body; // Default role is 'student'

  // Validate input
  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ message: 'Invalid input data.' });
  }

  // Validate role only if it is provided
  if (role && !validateRole(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  // Proceed with registration
  authController.register(req, res);
});

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  authController.login(req, res);
});

// Token refresh
router.post('/refresh-token', (req, res) => {
  authController.refreshToken(req, res);
});

module.exports = router;