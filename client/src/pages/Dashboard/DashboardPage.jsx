import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import styles from './DashboardPage.module.css';
import { BookMarked, Trophy, BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <motion.div
      className={styles.dashboardContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome, {user?.name || 'User'}!</h1>
        <p className={styles.subtitle}>Here's a summary of your quiz journey.</p>
      </header>

      <div className={styles.featureGrid}>
        {/* Wrap the card with a Link component */}
        <Link to="/dashboard/history" className={styles.featureLink}>
          <div className={styles.featureCard}>
            <BookMarked size={32} className={styles.featureIcon} />
            <h2 className={styles.featureTitle}>Quiz History</h2>
            <p className={styles.featureText}>Review your past quizzes and see your answers.</p>
          </div>
        </Link>
        
        <div className={`${styles.featureCard} ${styles.disabledCard}`}>
          <Trophy size={32} className={styles.featureIcon} />
          <h2 className={styles.featureTitle}>Leaderboards</h2>
          <p className={styles.featureText}>Coming Soon!</p>
        </div>
        
        <div className={`${styles.featureCard} ${styles.disabledCard}`}>
          <BarChart3 size={32} className={styles.featureIcon} />
          <h2 className={styles.featureTitle}>Performance</h2>
          <p className={styles.featureText}>Coming Soon!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
