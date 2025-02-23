const db = require('../config/db');

// Add a new question
const addQuestion = async (req, res) => {
  const { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer } = req.body;

  try {
    const [newQuestion] = await db.query(
      'INSERT INTO questions (company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer) VALUES (:company, :course, :pyq, :concept, :course_code, :option_a, :option_b, :option_c, :option_d, :answer) RETURNING *',
      {
        replacements: { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer }, // Use named replacements
        type: db.QueryTypes.INSERT, // Specify the query type
      }
    );

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error('Error adding question:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while adding question.' });
  }
};

// List all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await db.query('SELECT * FROM questions', {
      type: db.QueryTypes.SELECT, // Specify the query type
    });

    res.status(200).json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching questions.' });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer } = req.body;

  try {
    const [updatedQuestion] = await db.query(
      'UPDATE questions SET company = :company, course = :course, pyq = :pyq, concept = :concept, course_code = :course_code, option_a = :option_a, option_b = :option_b, option_c = :option_c, option_d = :option_d, answer = :answer WHERE question_id = :questionId RETURNING *',
      {
        replacements: { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer, questionId }, // Use named replacements
        type: db.QueryTypes.UPDATE, // Specify the query type
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    res.status(200).json(updatedQuestion);
  } catch (err) {
    console.error('Error updating question:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while updating question.' });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    await db.query('DELETE FROM questions WHERE question_id = :questionId', {
      replacements: { questionId }, // Use named replacements
      type: db.QueryTypes.DELETE, // Specify the query type
    });

    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('Error deleting question:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while deleting question.' });
  }
};

module.exports = { addQuestion, getQuestions, updateQuestion, deleteQuestion };