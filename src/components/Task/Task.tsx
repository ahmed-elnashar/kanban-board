import React, { useState } from 'react';
import type { Task as TaskType } from '../../types';
import { useTaskOperations } from '../../hooks/useTaskOperations';

interface TaskProps {
  task: TaskType;
}

export const Task: React.FC<TaskProps> = ({ task }) => {
  const { editTask, removeTask } = useTaskOperations();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ''
  );

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-violet-300 rounded-lg p-4 shadow-sm">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full mb-3 px-3 py-2 text-sm font-medium text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add description..."
          className="w-full mb-4 px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          rows={2}
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-colors"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Press Ctrl+Enter to save</p>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-slate-900 text-sm leading-relaxed flex-1 pr-2">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
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
            onClick={() => removeTask(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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

      {/* Task Description */}
      {task.description && (
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              task.status === 'todo'
                ? 'bg-slate-100 text-slate-700'
                : task.status === 'in-progress'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {task.status === 'todo'
              ? 'To Do'
              : task.status === 'in-progress'
              ? 'In Progress'
              : 'Done'}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

