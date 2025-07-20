import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import api from '../../services/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import styles from './HistoryPage.module.css';
import { LoaderCircle, ServerCrash, Inbox } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data } = await api.get('/quizzes/history');
        setHistory(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Couldn't load your quiz history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.centeredMessage}>
          <LoaderCircle size={32} className={styles.loaderIcon} />
          <p>Loading History...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.centeredMessage}>
          <ServerCrash size={32} className={styles.errorIcon} />
          <p>{error}</p>
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <Inbox size={32} className={styles.emptyIcon} />
          <p>You haven't completed any quizzes yet.</p>
        </div>
      );
    }

    return (
      <ul className={styles.historyList}>
        {history.map((quiz) => (
          
          <Link to={`/dashboard/history/${quiz._id}`} key={quiz._id} className={styles.historyLink}>
            <motion.li 
              className={styles.historyItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.itemHeader}>
                <h3 className={styles.itemTopic}>{quiz.topic}</h3>
                <span className={styles.itemDate}>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.itemScore}>
                Score: <span>{quiz.score} / {quiz.totalQuestions}</span>
              </div>
            </motion.li>
          </Link>
        ))}
      </ul>
    );
  };

  return (
    <motion.div
      className={styles.historyContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className={styles.title}>My Quiz History</h1>
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default HistoryPage;