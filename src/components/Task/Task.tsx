import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import styles from './Task.module.css';
import type { Task as TaskType } from '../../types';

interface TaskProps {
  task: TaskType;
}

export const Task: React.FC<TaskProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ''
  );
  const { editTask, removeTask } = useTaskOperations();

  // Only enable drag and drop when not editing
  const sortableConfig = {
    id: task.id,
    data: {
      type: 'task',
      task,
    },
    disabled: isEditing, // Disable drag when editing
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable(sortableConfig);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      editTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(task.id);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.task} ${styles.dragging}`}
      >
        <div className={styles.content}>
          <div className={styles.title}>{task.title}</div>
          {task.description && (
            <div className={styles.description}>{task.description}</div>
          )}
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div
        className={styles.task}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div
          className={styles.editForm}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              // Completely isolated keyboard handling for edit mode
              e.stopPropagation();
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
              // Let all other keys work normally
            }}
            className={styles.editInput}
            placeholder="Task title..."
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={(e) => {
              // Completely isolated keyboard handling for edit mode
              e.stopPropagation();
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
              // Let all other keys work normally
            }}
            className={styles.editTextarea}
            placeholder="Add description..."
            rows={3}
          />
          <div className={styles.editActions}>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              type="button"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className={styles.cancelButton}
              type="button"
            >
              Cancel
            </button>
          </div>
          <p className={styles.editHint}>Press Ctrl+Enter to save</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.task} ${styles.normal}`}
      {...(isEditing ? {} : { ...attributes, ...listeners })}
    >
      <div className={styles.content}>
        <div className={styles.title}>{task.title}</div>
        {task.description && (
          <div className={styles.description}>{task.description}</div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleEdit}
          className={styles.actionButton}
          title="Edit task"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className={styles.actionButton}
          title="Delete task"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

