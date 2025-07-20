import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuiz } from '../../contexts/QuizContext';
import styles from './HomePage.module.css';
import { Sparkles, LoaderCircle } from 'lucide-react';

const HomePage = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const navigate = useNavigate();
  const { generateNewQuiz, isLoading, error } = useQuiz();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const success = await generateNewQuiz(topic, numQuestions);
    if (success) {
      // If quiz generation is successful, navigate to the quiz page
      navigate('/quiz');
    }
  };

  return (
    <motion.div 
      className={styles.homeContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.heroSection}>
        <h1 className={styles.title}>
          Create Your Own Quiz with a Spark of AI
        </h1>
        <p className={styles.subtitle}>
          Enter any topic you can imagine, and our smart AI will generate a challenging quiz for you in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.quizForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="topic" className={styles.label}>Quiz Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={styles.input}
            placeholder="e.g., The Solar System, World War II, React.js Hooks"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="numQuestions" className={styles.label}>Number of Questions</label>
          <select
            id="numQuestions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className={styles.select}
            disabled={isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <motion.button 
          type="submit" 
          className={styles.submitButton}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle size={18} className={styles.loaderIcon} />
              Generating...
            </>
          ) : (
            <>
              Generate Quiz <Sparkles size={18} style={{ marginLeft: '8px' }} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default HomePage;