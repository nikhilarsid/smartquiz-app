import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthPage.module.css';
import { LogIn, LoaderCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, user } = useAuth(); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleGoogleAuth = (event) => {
      if (event.origin !== 'http://localhost:5000') return;

      if (event.data.type === 'google-auth-success') {
        
        const { user: googleUser, token } = event.data;
        
        localStorage.setItem('userInfo', JSON.stringify({ ...googleUser, token }));
        window.location.href = '/'; 
      }
    };

    window.addEventListener('message', handleGoogleAuth);
    return () => window.removeEventListener('message', handleGoogleAuth);
  }, [navigate]);


  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const openGoogleLogin = () => {
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    window.open(
      'http://localhost:5000/api/auth/google', 
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <motion.div 
      className={styles.authContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue your quiz journey.</p>
        
        <button onClick={openGoogleLogin} className={styles.googleButton}>
          <FcGoogle size={24} />
          <span>Sign In with Google</span>
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <motion.button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <LoaderCircle size={20} className={styles.loaderIcon} />
            ) : (
              <LogIn size={20} />
            )}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </motion.button>
        </form>

        <p className={styles.redirectText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.redirectLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
