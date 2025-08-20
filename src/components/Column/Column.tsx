import React, { memo } from 'react';
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

export const Column: React.FC<ColumnProps> = memo(({ column }) => {
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
          bgColor: styles.bgSlate50,
          borderColor: styles.borderSlate200,
          headerColor: styles.bgSlate100,
          titleColor: styles.textSlate700,
        };
      case 'in-progress':
        return {
          bgColor: styles.bgBlue50,
          borderColor: styles.borderBlue200,
          headerColor: styles.bgBlue100,
          titleColor: styles.textBlue700,
        };
      case 'done':
        return {
          bgColor: styles.bgEmerald50,
          borderColor: styles.borderEmerald200,
          headerColor: styles.bgEmerald100,
          titleColor: styles.textEmerald700,
        };
      default:
        return {
          bgColor: styles.bgSlate50,
          borderColor: styles.borderSlate200,
          headerColor: styles.bgSlate100,
          titleColor: styles.textSlate700,
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
});

