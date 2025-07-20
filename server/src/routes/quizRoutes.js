import express from 'express';
import { 
  generateNewQuiz, 
  saveQuizResult, 
  getQuizHistory,
  getQuizById
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/generate', generateNewQuiz);

// --- Private Routes ---
router.post('/save', protect, saveQuizResult);
router.get('/history', protect, getQuizHistory);


router.get('/:id', protect, getQuizById);


export default router;