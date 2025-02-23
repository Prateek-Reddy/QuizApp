const db = require('../config/db');

// Save a response
const saveResponse = async (req, res) => {
  const { attempt_id, responses } = req.body;

  try {
    for (const response of responses) {
      const { question_id, chosen_option } = response;

      // Fetch the correct answer for the question
      const [question] = await db.query(
        'SELECT answer FROM questions WHERE question_id = :question_id',
        {
          replacements: { question_id },
          type: db.QueryTypes.SELECT,
        }
      );

      const is_correct = chosen_option === question.answer;

      // Save the response
      await db.query(
        'INSERT INTO responses (attempt_id, question_id, chosen_option, is_correct) VALUES (:attempt_id, :question_id, :chosen_option, :is_correct)',
        {
          replacements: { attempt_id, question_id, chosen_option, is_correct },
          type: db.QueryTypes.INSERT,
        }
      );
    }

    res.status(201).json({ message: 'Responses saved successfully.' });
  } catch (err) {
    console.error('Error saving responses:', err);
    res.status(500).json({ message: 'Server error while saving responses.' });
  }
};

// Get all responses for an attempt
const getResponses = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const responses = await db.query('SELECT * FROM responses WHERE attempt_id = :attemptId', {
      replacements: { attemptId }, // Use named replacements
      type: db.QueryTypes.SELECT, // Specify the query type
    });

    res.status(200).json(responses);
  } catch (err) {
    console.error('Error fetching responses:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching responses.' });
  }
};

module.exports = { saveResponse, getResponses };