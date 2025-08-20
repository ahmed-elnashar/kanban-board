import React from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import styles from './TaskHistory.module.css';

export const TaskHistory: React.FC = () => {
  const { taskHistory, showHistory } = useKanbanStore();

  if (!showHistory) {
    return null;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        );
      case 'moved':
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'edited':
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
      case 'deleted':
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return styles.created;
      case 'moved':
        return styles.moved;
      case 'edited':
        return styles.edited;
      case 'deleted':
        return styles.deleted;
      default:
        return '';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h3 className={styles.historyTitle}>Recent Activity</h3>
        <span className={styles.historyCount}>
          {taskHistory.length} actions
        </span>
      </div>

      <div className={styles.historyList}>
        {taskHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" />
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" />
              <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" />
              <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" />
            </svg>
            <p>No activity yet</p>
            <span>Your task actions will appear here</span>
          </div>
        ) : (
          taskHistory.map((item) => (
            <div key={item.id} className={styles.historyItem}>
              <div
                className={`${styles.actionIcon} ${getActionColor(
                  item.action
                )}`}
              >
                {getActionIcon(item.action)}
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyText}>
                  <strong>{item.taskTitle}</strong> was {item.action}
                  {item.fromStatus && item.toStatus && (
                    <span>
                      {' '}
                      from <strong>{item.fromStatus}</strong> to{' '}
                      <strong>{item.toStatus}</strong>
                    </span>
                  )}
                </div>
                <div className={styles.historyTime}>
                  {formatTime(item.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

