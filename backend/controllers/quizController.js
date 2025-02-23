const db = require('../config/db');

// Create a new quiz
const createQuiz = async (req, res) => {
  const { creator_id, subject, company } = req.body;

  try {
    const [newQuiz] = await db.query(
      'INSERT INTO quizzes (creator_id, subject, company) VALUES (:creator_id, :subject, :company) RETURNING quiz_id, creator_id, subject, company, created_at',
      {
        replacements: { creator_id, subject, company }, // Use named replacements
        type: db.QueryTypes.INSERT, // Specify the query type
      }
    );

    res.status(201).json(newQuiz);
  } catch (err) {
    console.error('Error creating quiz:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while creating quiz.' });
  }
};

// List all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await db.query('SELECT * FROM quizzes', {
      type: db.QueryTypes.SELECT, // Specify the query type
    });

    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while fetching quizzes.' });
  }
};

// Get a specific quiz by ID
const getQuizById = async (req, res) => {
  const { quizId } = req.params;

  try {
    // Fetch the quiz details
    const [quiz] = await db.query('SELECT * FROM quizzes WHERE quiz_id = :quizId', {
      replacements: { quizId },
      type: db.QueryTypes.SELECT,
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Fetch the linked questions
    const questions = await db.query(
      `SELECT q.* FROM questions q
       JOIN quiz_questions qq ON q.question_id = qq.question_id
       WHERE qq.quiz_id = :quizId`,
      {
        replacements: { quizId },
        type: db.QueryTypes.SELECT,
      }
    );

    // Map the answer field to the correct option
    const formattedQuestions = questions.map((question) => {
      const { answer, option_a, option_b, option_c, option_d } = question;
      let correctAnswer;

      switch (answer) {
        case 'OptionA':
          correctAnswer = option_a;
          break;
        case 'OptionB':
          correctAnswer = option_b;
          break;
        case 'OptionC':
          correctAnswer = option_c;
          break;
        case 'OptionD':
          correctAnswer = option_d;
          break;
        default:
          correctAnswer = 'Unknown';
      }

      return {
        ...question,
        correctAnswer, // Add the correct answer text to the question object
      };
    });

    // Add the formatted questions to the quiz object
    quiz.questions = formattedQuestions;

    res.status(200).json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ message: 'Server error while fetching quiz.' });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    await db.query('DELETE FROM quizzes WHERE quiz_id = :quizId', {
      replacements: { quizId }, // Use named replacements
      type: db.QueryTypes.DELETE, // Specify the query type
    });

    res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (err) {
    console.error('Error deleting quiz:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error while deleting quiz.' });
  }
};

// Auto-create quizzes based on distinct company and course
const autoCreateQuizzes = async (req, res) => {
  try {
    // Step 1: Fetch distinct company and course combinations
    const combinations = await db.query(
      'SELECT DISTINCT company, course FROM questions',
      {
        type: db.QueryTypes.SELECT,
      }
    );

    // Step 2: Create quizzes and link questions
    for (const { company, course } of combinations) {
      // Create a new quiz
      const [newQuiz] = await db.query(
        'INSERT INTO quizzes (creator_id, subject, company) VALUES (:creator_id, :subject, :company) RETURNING *',
        {
          replacements: { creator_id: 1, subject: course, company }, // Default creator_id (e.g., admin)
          type: db.QueryTypes.INSERT,
        }
      );

      const quiz_id = newQuiz[0].quiz_id; // Extract quiz_id from the returned object

      // Step 3: Select up to 20 random questions for the quiz
      const questions = await db.query(
        'SELECT question_id FROM questions WHERE company = :company AND course = :course ORDER BY RANDOM() LIMIT 20',
        {
          replacements: { company, course },
          type: db.QueryTypes.SELECT,
        }
      );

      // Step 4: Link questions to the quiz
      for (const { question_id } of questions) {
        await db.query(
          'INSERT INTO quiz_questions (quiz_id, question_id) VALUES (:quiz_id, :question_id)',
          {
            replacements: { quiz_id, question_id },
            type: db.QueryTypes.INSERT,
          }
        );
      }
    }

    res.status(201).json({ message: 'Quizzes auto-created successfully.' });
  } catch (err) {
    console.error('Error auto-creating quizzes:', err);
    res.status(500).json({ message: 'Server error while auto-creating quizzes.' });
  }
};

module.exports = { createQuiz, getQuizzes, getQuizById, deleteQuiz, autoCreateQuizzes  };