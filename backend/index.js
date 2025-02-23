const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');

dotenv.config();

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/quizzes', require('./routes/quizRoutes'));
app.use('/questions', require('./routes/questionRoutes'));
app.use('/attempts', require('./routes/attemptRoutes'));
app.use('/responses', require('./routes/responseRoutes'));
app.use('/analytics', require('./routes/analyticsRoutes'));
app.use('/admin', require('./routes/adminRoutes')); // Add admin routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

