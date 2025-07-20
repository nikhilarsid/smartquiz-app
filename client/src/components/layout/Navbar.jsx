import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit, LayoutDashboard, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header 
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className={`${styles.nav} container`}>
        <Link to="/" className={styles.logo}>
          <BrainCircuit size={28} className={styles.logoIcon} />
          <span className={styles.logoText}>SmartQuiz</span>
        </Link>
        <div className={styles.navLinks}>
          {user ? (
            <>
              <Link to="/dashboard" className={styles.navLinkItem}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;