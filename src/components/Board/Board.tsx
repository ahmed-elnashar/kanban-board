import React, { memo, useMemo } from 'react';
import { useKanbanData } from '../../hooks/useKanbanData';
import { useKanbanStore } from '../../store/kanbanStore';
import { DndProvider } from '../DndProvider/DndProvider';
import { Column } from '../Column/Column';
import { Filter } from '../Filter/Filter';
import { TaskHistory } from '../TaskHistory/TaskHistory';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './Board.module.css';

export const Board: React.FC = memo(() => {
  const {
    columns,
    totalTasks,
    completedTasks,
    progressPercentage,
    isFiltered,
  } = useKanbanData();
  const { resetStore } = useKanbanStore();

  // Memoize expensive calculations
  const boardStats = useMemo(
    () => ({
      totalTasks: totalTasks || 0,
      completedTasks: completedTasks || 0,
      progressPercentage: progressPercentage || 0,
    }),
    [totalTasks, completedTasks, progressPercentage]
  );

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
      <div
        id="board"
        className={styles.board}
        role="main"
        aria-label="Kanban Board"
      >
        {/* Board Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>Kanban Board</h1>
              <p className={styles.subtitle}>
                Manage your tasks and track progress efficiently
              </p>
            </div>
            <div
              className={styles.stats}
              role="region"
              aria-label="Board Statistics"
            >
              <div className={styles.stat}>
                <div
                  className={`${styles.statValue} ${styles.total}`}
                  aria-label={`Total tasks: ${boardStats.totalTasks}`}
                >
                  {boardStats.totalTasks}
                </div>
                <div className={styles.statLabel}>Total Tasks</div>
              </div>
              <div className={styles.stat}>
                <div
                  className={`${styles.statValue} ${styles.completed}`}
                  aria-label={`Completed tasks: ${boardStats.completedTasks}`}
                >
                  {boardStats.completedTasks}
                </div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.stat}>
                <div
                  className={`${styles.statValue} ${styles.progress}`}
                  aria-label={`Progress: ${boardStats.progressPercentage}%`}
                >
                  {boardStats.progressPercentage}%
                </div>
                <div className={styles.statLabel}>Progress</div>
              </div>
              <button
                onClick={handleReset}
                className={styles.resetButton}
                aria-label="Reset board and clear all data"
                title="Reset Board"
              >
                Reset Board
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {boardStats.totalTasks > 0 && (
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={boardStats.progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress: ${boardStats.progressPercentage}%`}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${boardStats.progressPercentage}%` }}
              />
            </div>
          )}
        </header>

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
        <div className={styles.columns} role="region" aria-label="Task Columns">
          {columns && columns.length > 0 ? (
            columns.map((column) => <Column key={column.id} column={column} />)
          ) : (
            <div className={styles.loading}>
              <LoadingSpinner size="large" text="Loading board..." />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
});

