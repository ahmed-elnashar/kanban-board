import React from 'react';
import type { Column as ColumnType } from '../../types';
import { Task } from '../Task/Task';
import { AddTask } from '../AddTask/AddTask';

interface ColumnProps {
  column: ColumnType;
}

export const Column: React.FC<ColumnProps> = ({ column }) => {
  const getColumnTheme = (status: string) => {
    switch (status) {
      case 'todo':
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          header: 'bg-slate-100',
          accent: 'text-slate-700',
          icon: 'text-slate-600',
        };
      case 'in-progress':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          header: 'bg-blue-100',
          accent: 'text-blue-700',
          icon: 'text-blue-600',
        };
      case 'done':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          header: 'bg-emerald-100',
          accent: 'text-emerald-700',
          icon: 'text-emerald-600',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          header: 'bg-slate-100',
          accent: 'text-slate-700',
          icon: 'text-slate-600',
        };
    }
  };

  const getColumnIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case 'in-progress':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'done':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const theme = getColumnTheme(column.id);

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`${theme.header} ${theme.border} border rounded-t-xl p-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${theme.icon}`}>{getColumnIcon(column.id)}</div>
            <h3 className={`font-semibold text-lg ${theme.accent}`}>
              {column.title}
            </h3>
          </div>
          <span
            className={`${theme.bg} px-3 py-1 rounded-full text-sm font-medium ${theme.accent}`}
          >
            {column.tasks.length}
          </span>
        </div>

        {/* Add Task Button */}
        <AddTask />
      </div>

      {/* Column Content */}
      <div
        className={`${theme.bg} ${theme.border} border-l border-r border-b rounded-b-xl flex-1 p-4 min-h-[500px]`}
      >
        {/* Tasks */}
        <div className="space-y-3">
          {column.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>

        {/* Empty State */}
        {column.tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div
              className={`w-16 h-16 ${theme.bg} rounded-full flex items-center justify-center mb-4`}
            >
              <div className={theme.icon}>{getColumnIcon(column.id)}</div>
            </div>
            <p className={`font-medium ${theme.accent}`}>No tasks yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Tasks you add will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

