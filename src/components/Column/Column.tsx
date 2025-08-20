import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddTask } from '../AddTask/AddTask';
import { Task } from '../Task/Task';
import styles from './Column.module.css';
import type { Column as ColumnType } from '../../types';

interface ColumnProps {
  column: ColumnType;
}

export const Column: React.FC<ColumnProps> = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getColumnTheme = (status: string) => {
    switch (status) {
      case 'todo':
        return {
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          headerColor: 'bg-slate-100',
          titleColor: 'text-slate-700',
        };
      case 'in-progress':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          headerColor: 'bg-blue-100',
          titleColor: 'text-blue-700',
        };
      case 'done':
        return {
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          headerColor: 'bg-emerald-100',
          titleColor: 'text-emerald-700',
        };
      default:
        return {
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          headerColor: 'bg-slate-100',
          titleColor: 'text-slate-700',
        };
    }
  };

  const theme = getColumnTheme(column.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.column} ${theme.bgColor} ${theme.borderColor} ${
        isDragging ? styles.dragging : ''
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Column Header */}
      <div className={`${styles.header} ${theme.headerColor}`}>
        <h3 className={`${styles.title} ${theme.titleColor}`}>
          {column.title}
        </h3>
        <span className={styles.taskCount}>{column.tasks.length}</span>
      </div>

      {/* Add Task Button */}
      <AddTask columnId={column.status} />

      {/* Tasks */}
      <div className={styles.tasks}>
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task, index) => (
            <Task
              key={`${task.id}-${index}-${task.createdAt.getTime()}`}
              task={task}
            />
          ))}
        </SortableContext>
        {column.tasks.length === 0 && (
          <div className={styles.emptyState}>
            <p>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

