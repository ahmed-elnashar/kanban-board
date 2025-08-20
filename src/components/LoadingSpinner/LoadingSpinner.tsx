import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
}) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.spinnerInner}></div>
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
};

