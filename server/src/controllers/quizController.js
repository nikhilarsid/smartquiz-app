import { generateQuiz } from '../services/aiQuizService.js';
import Quiz from '../models/Quiz.js';


const generateNewQuiz = async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;

    if (!topic || !numQuestions) {
      res.status(400);
      throw new Error('Please provide a topic and the number of questions.');
    }
    if (numQuestions > 30) {
        res.status(400);
        throw new Error('Number of questions cannot exceed 30.');
    }

    console.log(`Generating a ${numQuestions}-question quiz on the topic: "${topic}"...`);
    const quizQuestions = await generateQuiz(topic, numQuestions);

    res.status(200).json(quizQuestions);

  } catch (error) {
    console.error('Error in generateNewQuiz controller:', error.message);
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};


const saveQuizResult = async (req, res) => {
  try {
    const { topic, score, totalQuestions, questions } = req.body;
    const userId = req.user._id;

    const quiz = new Quiz({
      user: userId,
      topic,
      score,
      totalQuestions,
      questions,
    });

    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);

  } catch (error) {
    console.error('Error saving quiz result:', error.message);
    res.status(500).json({ message: 'Server error while saving quiz result.' });
  }
};


const getQuizHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quiz history:', error.message);
    res.status(500).json({ message: 'Server error while fetching quiz history.' });
  }
};


const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      
      if (quiz.user.toString() !== req.user._id.toString()) {
        res.status(403); // Forbidden
        throw new Error('User not authorized to view this quiz');
      }
      res.json(quiz);
    } else {
      res.status(404);
      throw new Error('Quiz not found');
    }
  } catch (error) {
    
    throw error;
  }
};


export { generateNewQuiz, saveQuizResult, getQuizHistory, getQuizById };