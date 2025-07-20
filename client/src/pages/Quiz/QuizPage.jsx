import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './QuizPage.module.css';

const QuizPage = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    topic,
    isQuizOver,
    submitAnswer,
    nextQuestion 
  } = useQuiz();
  
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  
  useEffect(() => {
    if (isQuizOver) {
      
      navigate('/results');
    }
  }, [isQuizOver, navigate]);

  
  useEffect(() => {
    if (questions.length === 0 && !isQuizOver) {
      navigate('/');
    }
  }, [questions, navigate, isQuizOver]);

  const handleAnswerSelect = (option) => {
    if (isAnswered) return; 
    setSelectedAnswer(option);
  };

  const handleSubmitOrNext = () => {
    if (!isAnswered) {
      // Submitting the answer
      if (selectedAnswer) {
        submitAnswer(selectedAnswer);
        setIsAnswered(true);
      }
    } else {
      // Moving to the next question
      nextQuestion();
      setIsAnswered(false);
      setSelectedAnswer(null);
    }
  };

 
  const getButtonClass = (option) => {
    if (!isAnswered) {
      return selectedAnswer === option ? styles.selected : '';
    }
    // After answering
    if (option === currentQuestion.correctAnswer) {
      return styles.correct;
    }
    if (option === selectedAnswer) {
      return styles.incorrect;
    }
    return '';
  };

  if (questions.length === 0 || !currentQuestion) {
    return null; // Or a loading spinner
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.header}>
        <h2 className={styles.topicTitle}>{topic}</h2>
        <div className={styles.progressInfo}>
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>
      
      <div className={styles.progressBar}>
        <motion.div 
          className={styles.progressFill}
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          className={styles.questionCard}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={styles.questionText}>{currentQuestion.question}</h3>
          
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                className={`${styles.optionButton} ${getButtonClass(option)}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                whileHover={{ scale: isAnswered ? 1 : 1.03 }}
                whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.footer}>
        <button 
          className={styles.nextButton} 
          onClick={handleSubmitOrNext}
          disabled={!selectedAnswer}
        >
          {isAnswered ? (currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question') : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;