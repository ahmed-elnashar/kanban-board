import React from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import styles from './Filter.module.css';

export const Filter: React.FC = () => {
  const { filterQuery, setFilterQuery, showHistory, toggleHistory } =
    useKanbanStore();

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchContainer}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks... (Ctrl+K)"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className={styles.searchInput}
        />
        {filterQuery && (
          <button
            onClick={() => setFilterQuery('')}
            className={styles.clearButton}
            title="Clear search (Esc)"
          >
            <svg
              width="16"
              height="16"
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
        )}
      </div>

      <button
        onClick={toggleHistory}
        className={`${styles.historyButton} ${
          showHistory ? styles.active : ''
        }`}
        title="Toggle task history (Ctrl+H)"
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
          <path d="M3 3v18h18" />
          <path d="m9 9 3 3 3-3" />
          <path d="M12 12v6" />
        </svg>
        History
      </button>
    </div>
  );
};

