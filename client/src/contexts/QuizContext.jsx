import React, { createContext, useContext, useState } from 'react';
import api from '../services/api'; 
import { useAuth } from './AuthContext';


const QuizContext = createContext();


export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState({
    topic: '',
    numQuestions: 10,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [],
    isQuizOver: false,
    isLoading: false,
    error: null,
  });

  // Function to generate a new quiz
  const generateNewQuiz = async (topic, numQuestions) => {
    setQuizState(prevState => ({ 
        ...prevState, 
        isLoading: true, 
        error: null,
        isQuizOver: false,
    }));
    try {
     
      const { data } = await api.post('/quizzes/generate', {
        topic,
        numQuestions,
      });
      setQuizState(prevState => ({
        ...prevState,
        topic,
        numQuestions,
        questions: data,
        isLoading: false,
        currentQuestionIndex: 0,
        score: 0,
        userAnswers: [],
      }));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate quiz.';
      setQuizState(prevState => ({ ...prevState, isLoading: false, error: errorMessage }));
      return false;
    }
  };

  
  const submitAnswer = (selectedAnswer) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === selectedAnswer;

    setQuizState(prevState => ({
      ...prevState,
      score: isCorrect ? prevState.score + 1 : prevState.score,
      userAnswers: [
        ...prevState.userAnswers,
        { 
          question: currentQuestion.question,
          options: currentQuestion.options,
          selectedAnswer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect 
        }
      ]
    }));
  };

  
  const nextQuestion = async () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
      }));
    } else {
      if (user) {
        try {
          const quizDataToSave = {
            topic: quizState.topic,
            score: quizState.score,
            totalQuestions: quizState.questions.length,
            questions: quizState.userAnswers,
          };
          
          await api.post('/quizzes/save', quizDataToSave);
        } catch (err) {
          console.error('Failed to save quiz result:', err);
        }
      }
      setQuizState(prevState => ({ ...prevState, isQuizOver: true }));
    }
  };

  const value = {
    ...quizState,
    generateNewQuiz,
    submitAnswer,
    nextQuestion,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};


export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};