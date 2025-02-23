const db = require('../config/db');
const { hashPassword,comparePassword,generateToken } = require('../utils/helpers');
const { validateEmail, validatePassword, validateRole } = require('../utils/validators');

// Register a new user
const register = async (req, res) => {
  const { email, password, role = 'student' } = req.body; // Default role is 'student'

  try {
    // Check if the email already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', {
      replacements: [email],
      type: db.QueryTypes.SELECT,
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const [newUser] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?) RETURNING user_id, email, role',
      {
        replacements: [email, hashedPassword, role],
        type: db.QueryTypes.INSERT,
      }
    );

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', {
      replacements: [email],
      type: db.QueryTypes.SELECT,
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = generateToken(user.user_id, user.role);

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const token = generateToken(decoded.user_id, decoded.role);

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(401).json({ message: 'Invalid refresh token.' });
  }
};

module.exports = { register, login, refreshToken };