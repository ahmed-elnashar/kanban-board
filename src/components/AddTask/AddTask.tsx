import React, { useState } from 'react';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import type { Task } from '../../types';

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

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full group flex items-center justify-center px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200"
      >
        <svg
          width="20"
          height="20"
          className="mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="font-medium">Add New Task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full mb-3 px-3 py-2 text-sm font-medium text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description (optional)..."
          className="w-full mb-3 px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
          rows={2}
        />
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

