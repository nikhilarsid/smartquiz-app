import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Home, Repeat } from 'lucide-react';
import styles from './ResultsPage.module.css';

const ResultsPage = () => {
  const { score, numQuestions, userAnswers, topic, isQuizOver } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isQuizOver) {
      navigate('/');
    }
  }, [isQuizOver, navigate]);

  const getPerformanceMessage = () => {
    const percentage = (score / numQuestions) * 100;
    if (percentage === 100) return "Perfect Score! You're a master of this topic!";
    if (percentage >= 75) return "Excellent work! You really know your stuff.";
    if (percentage >= 50) return "Good job! A solid performance.";
    return "Nice try! Every quiz is a learning opportunity.";
  };

  if (!isQuizOver) {
    return null; 
  }

  return (
    <motion.div
      className={styles.resultsContainer}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.summaryCard}>
        <h1 className={styles.title}>Quiz Complete!</h1>
        <p className={styles.topic}>Topic: {topic}</p>
        <div className={styles.scoreCircle}>
          <span className={styles.score}>{score}</span>
          <span className={styles.total}>/ {numQuestions}</span>
        </div>
        <p className={styles.performanceMessage}>{getPerformanceMessage()}</p>
      </div>

      <div className={styles.reviewSection}>
        <h2 className={styles.reviewTitle}>Review Your Answers</h2>
        <ul className={styles.answerList}>
          {userAnswers.map((answer, index) => (
            <li key={index} className={styles.answerItem}>
              <div className={styles.questionHeader}>
                {answer.isCorrect ? (
                  <CheckCircle size={20} className={styles.correctIcon} />
                ) : (
                  <XCircle size={20} className={styles.incorrectIcon} />
                )}
                <p className={styles.questionText}>{answer.question}</p>
              </div>
              <div className={styles.answerDetails}>
                <p>Your answer: <span className={answer.isCorrect ? styles.correctText : styles.incorrectText}>{answer.selectedAnswer}</span></p>
                {!answer.isCorrect && (
                  <p>Correct answer: <span className={styles.correctText}>{answer.correctAnswer}</span></p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={() => navigate('/')}>
          <Home size={16} /> New Quiz
        </button>
        
      </div>
    </motion.div>
  );
};

export default ResultsPage;