import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import styles from './HistoryDetailPage.module.css';
import { LoaderCircle, ServerCrash, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const HistoryDetailPage = () => {
  const { id } = useParams(); 
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data);
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
        setError("Could not load quiz details. It might not exist or you may not have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.centeredMessage}>
        <LoaderCircle size={32} className={styles.loaderIcon} />
        <p>Loading Quiz Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centeredMessage}>
        <ServerCrash size={32} className={styles.errorIcon} />
        <p>{error}</p>
        <Link to="/dashboard/history" className={styles.backButton}>
            <ArrowLeft size={16} /> Go Back to History
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return null; 
  }

  return (
    <motion.div
      className={styles.detailContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to="/dashboard/history" className={styles.backButton}>
        <ArrowLeft size={16} /> Back to History
      </Link>
      
      <header className={styles.header}>
        <h1 className={styles.topic}>{quiz.topic}</h1>
        <p className={styles.date}>Taken on {new Date(quiz.createdAt).toLocaleString()}</p>
        <div className={styles.scoreSummary}>
          Final Score: <span>{quiz.score} / {quiz.totalQuestions}</span>
        </div>
      </header>

      <div className={styles.reviewSection}>
        <h2 className={styles.reviewTitle}>Your Answers</h2>
        <ul className={styles.answerList}>
          {quiz.questions.map((q, index) => (
            <li key={index} className={styles.answerItem}>
              <div className={styles.questionHeader}>
                {q.isCorrect ? (
                  <CheckCircle size={20} className={styles.correctIcon} />
                ) : (
                  <XCircle size={20} className={styles.incorrectIcon} />
                )}
                <p className={styles.questionText}>{q.question}</p>
              </div>
              <div className={styles.answerDetails}>
                <p>Your answer: <span className={q.isCorrect ? styles.correctText : styles.incorrectText}>{q.selectedAnswer}</span></p>
                {!q.isCorrect && (
                  <p>Correct answer: <span className={styles.correctText}>{q.correctAnswer}</span></p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default HistoryDetailPage;