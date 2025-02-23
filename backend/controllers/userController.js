const db = require('../config/db');
const { validateRole } = require('../utils/validators');

// Get user profile
const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.query('SELECT user_id, email, role, created_at FROM users WHERE user_id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

// Update user profile (including role) - Admin only
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { email, password, role } = req.body;

  try {
    // Validate role
    if (role && !validateRole(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // Hash the new password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Update the user in the database
    const updatedUser = await db.query(
      'UPDATE users SET email = COALESCE($1, email), password_hash = COALESCE($2, password_hash), role = COALESCE($3, role) WHERE user_id = $4 RETURNING user_id, email, role',
      [email, hashedPassword, role, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

module.exports = { getProfile, updateProfile };