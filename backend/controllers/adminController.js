const db = require('../config/db');
const { hashPassword } = require('../utils/helpers');
const { validateEmail, validatePassword, validateRole } = require('../utils/validators');

const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate input
  if (!validateEmail(email) || !validatePassword(password) || !validateRole(role)) {
    return res.status(400).json({ message: 'Invalid input data.' });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    // Insert the new user into the database
    const [newUser] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (:email, :password, :role) RETURNING user_id, email, role',
      {
        replacements: { email, password: hashedPassword, role },
        type: db.QueryTypes.INSERT,
      }
    );

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error while creating user.' });
  }
};

// Export the function
module.exports = { createUser };