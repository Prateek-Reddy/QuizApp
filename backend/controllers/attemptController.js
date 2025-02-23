const db = require('../config/db');

// Start a new quiz attempt
const startAttempt = async (req, res) => {
  const { user_id, quiz_id } = req.body;

  try {
    const [newAttempt] = await db.query(
      'INSERT INTO attempts (user_id, quiz_id) VALUES (:user_id, :quiz_id) RETURNING *',
      {
        replacements: { user_id, quiz_id },
        type: db.QueryTypes.INSERT,
      }
    );

    res.status(201).json(newAttempt);
  } catch (err) {
    console.error('Error starting attempt:', err);
    res.status(500).json({ message: 'Server error while starting attempt.' });
  }
};

// Submit a quiz attempt
const submitAttempt = async (req, res) => {
  const { attempt_id } = req.body;

  try {
    // Fetch all responses for the attempt
    const responses = await db.query(
      'SELECT * FROM responses WHERE attempt_id = :attempt_id',
      {
        replacements: { attempt_id },
        type: db.QueryTypes.SELECT,
      }
    );

    // Calculate score and accuracy
    const totalQuestions = responses.length;
    const correctAnswers = responses.filter((response) => response.is_correct).length;
    const score = correctAnswers;
    const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // Update the attempt with the score and accuracy
    await db.query(
      'UPDATE attempts SET score = :score, accuracy = :accuracy WHERE attempt_id = :attempt_id',
      {
        replacements: { score, accuracy, attempt_id },
        type: db.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({ message: 'Quiz submitted successfully.', score, accuracy });
  } catch (err) {
    console.error('Error submitting attempt:', err);
    res.status(500).json({ message: 'Server error while submitting attempt.' });
  }
};

// Get attempt details
const getAttemptDetails = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const [attempt] = await db.query('SELECT * FROM attempts WHERE attempt_id = :attemptId', {
      replacements: { attemptId }, // Use named replacements
      type: db.QueryTypes.SELECT, // Specify the query type
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found.' });
    }

    res.status(200).json(attempt);
  } catch (err) {
    console.error('Error fetching attempt details:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching attempt details.' });
  }
};

module.exports = { startAttempt, submitAttempt, getAttemptDetails };