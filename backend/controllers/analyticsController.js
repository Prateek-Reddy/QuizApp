const db = require('../config/db');

// Get quiz performance analytics
const getQuizPerformance = async (req, res) => {
  try {
    const quizPerformance = await db.query(
      'SELECT quiz_id, AVG(score) AS avg_score, AVG(accuracy) AS avg_accuracy FROM attempts GROUP BY quiz_id',
      {
        type: db.QueryTypes.SELECT, // Specify the query type
      }
    );

    res.status(200).json(quizPerformance);
  } catch (err) {
    console.error('Error fetching quiz performance:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching quiz performance.' });
  }
};

// Get user performance analytics
const getUserPerformance = async (req, res) => {
  try {
    const userPerformance = await db.query(
      'SELECT user_id, COUNT(attempt_id) AS quizzes_attempted, AVG(score) AS avg_score FROM attempts GROUP BY user_id',
      {
        type: db.QueryTypes.SELECT, // Specify the query type
      }
    );

    res.status(200).json(userPerformance);
  } catch (err) {
    console.error('Error fetching user performance:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching user performance.' });
  }
};

module.exports = { getQuizPerformance, getUserPerformance };