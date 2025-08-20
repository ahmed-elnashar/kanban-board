import React, { useState, useEffect, useRef } from 'react';
import styles from './KeyboardShortcuts.module.css';

export const KeyboardShortcuts: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className={styles.toggleButton}
        title="Keyboard shortcuts"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <line x1="6" y1="8" x2="6" y2="8" />
          <line x1="10" y1="8" x2="10" y2="8" />
          <line x1="6" y1="12" x2="6" y2="12" />
          <line x1="10" y1="12" x2="10" y2="12" />
          <line x1="6" y1="16" x2="6" y2="16" />
          <line x1="10" y1="16" x2="10" y2="16" />
          <line x1="14" y1="8" x2="18" y2="8" />
          <line x1="14" y1="12" x2="18" y2="12" />
          <line x1="14" y1="16" x2="18" y2="16" />
        </svg>
      </button>
    );
  }

  return (
    <div className={styles.shortcutsModal}>
      <div ref={modalRef} className={styles.shortcutsContent}>
        <div className={styles.shortcutsHeader}>
          <h3>Keyboard Shortcuts</h3>
          <button onClick={toggleVisibility} className={styles.closeButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.shortcutsList}>
          <div className={styles.shortcutItem}>
            <kbd className={styles.key}>Ctrl+K</kbd>
            <span>Focus search</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.key}>Ctrl+H</kbd>
            <span>Toggle history</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.key}>Esc</kbd>
            <span>Clear search</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.key}>Ctrl+Enter</kbd>
            <span>Save task (when editing)</span>
          </div>
          <div className={styles.shortcutItem}>
            <kbd className={styles.key}>Esc</kbd>
            <span>Cancel editing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

