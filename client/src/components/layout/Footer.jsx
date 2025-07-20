import React from 'react';
import styles from './Footer.module.css';
import { Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} container`}>
        <p className={styles.copyright}>
          &copy; {currentYear} SmartQuiz. All Rights Reserved.
        </p>
        <div className={styles.socialLinks}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
            <Globe size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;