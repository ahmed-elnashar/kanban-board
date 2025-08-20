import React, { useState } from 'react';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import type { Task } from '../../types';
import styles from './AddTask.module.css';

interface AddTaskProps {
  columnId: Task['status'];
}

export const AddTask: React.FC<AddTaskProps> = ({ columnId }) => {
  const { createTask } = useTaskOperations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTask(title.trim(), description.trim() || undefined, columnId);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  const toggleForm = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Clear form when expanding
      setTitle('');
      setDescription('');
    }
  };

  if (!isExpanded) {
    return (
      <div 
        className={styles.addTaskContainer}
        onClick={toggleForm}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleForm();
          }
        }}
        aria-label="Add new task to this column"
        title="Add New Task"
      >
        <svg
          aria-hidden="true"
          className={styles.icon}
          fill="none"
          height="20"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="20"
        >
          <path
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className={styles.buttonText}>Add New Task</span>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className={styles.titleInput}
          required
          autoFocus
          onKeyDown={(e) => e.stopPropagation()}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          className={styles.descriptionInput}
          rows={3}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={!title.trim()}
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

