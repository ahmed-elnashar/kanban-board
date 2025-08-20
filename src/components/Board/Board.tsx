import React from 'react';
import { useKanbanData } from '../../hooks/useKanbanData';
import { Column } from '../Column/Column';
import styles from './Board.module.css';

export const Board: React.FC = () => {
  const { columns, totalTasks, completedTasks, progressPercentage } =
    useKanbanData();

  return (
    <div className={styles.board}>
      {/* Board Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Kanban Board</h1>
            <p className={styles.subtitle}>
              Manage your tasks and track progress efficiently
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={`${styles.statValue} ${styles.total}`}>
                {totalTasks}
              </div>
              <div className={styles.statLabel}>Total Tasks</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.statValue} ${styles.completed}`}>
                {completedTasks}
              </div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.statValue} ${styles.progress}`}>
                {progressPercentage}%
              </div>
              <div className={styles.statLabel}>Progress</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Kanban Columns */}
      <div className={styles.columns}>
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

