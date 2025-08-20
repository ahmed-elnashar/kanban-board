import React from 'react';
import { useKanbanData } from '../../hooks/useKanbanData';
import { useKanbanStore } from '../../store/kanbanStore';
import { DndProvider } from '../DndProvider/DndProvider';
import { Column } from '../Column/Column';
import { Filter } from '../Filter/Filter';
import { TaskHistory } from '../TaskHistory/TaskHistory';
import styles from './Board.module.css';

export const Board: React.FC = () => {
  const {
    columns,
    totalTasks,
    completedTasks,
    progressPercentage,
    isFiltered,
  } = useKanbanData();
  const { resetStore } = useKanbanStore();

  const handleReset = () => {
    if (
      window.confirm(
        'This will clear all data and reset the board. Are you sure?'
      )
    ) {
      resetStore();
    }
  };

  return (
    <DndProvider>
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
                  {totalTasks || 0}
                </div>
                <div className={styles.statLabel}>Total Tasks</div>
              </div>
              <div className={styles.stat}>
                <div className={`${styles.statValue} ${styles.completed}`}>
                  {completedTasks || 0}
                </div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.stat}>
                <div className={`${styles.statValue} ${styles.progress}`}>
                  {progressPercentage || 0}%
                </div>
                <div className={styles.statLabel}>Progress</div>
              </div>
              <button onClick={handleReset} className={styles.resetButton}>
                Reset Board
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {(totalTasks || 0) > 0 && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage || 0}%` }}
              />
            </div>
          )}
        </div>

        {/* Filter and History */}
        <Filter />
        <TaskHistory />

        {/* Filter Status */}
        {isFiltered && (
          <div className={styles.filterStatus}>
            <span>Showing filtered results</span>
          </div>
        )}

        {/* Kanban Columns */}
        <div className={styles.columns}>
          {columns && columns.length > 0 ? (
            columns.map((column) => <Column key={column.id} column={column} />)
          ) : (
            <div className={styles.loading}>Loading board...</div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

