import { useCallback } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useOptimizedTaskOperations = () => {
  const { addTask, updateTask, deleteTask, moveTask } = useKanbanStore();

  const createTask = useCallback(
    (title: string, description?: string, columnId?: string) => {
      addTask(title, description, columnId);
    },
    [addTask]
  );

  const editTask = useCallback(
    (taskId: string, updates: { title: string; description?: string }) => {
      updateTask(taskId, updates);
    },
    [updateTask]
  );

  const removeTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
    },
    [deleteTask]
  );

  const moveTaskToColumn = useCallback(
    (taskId: string, newStatus: string) => {
      moveTask(taskId, newStatus);
    },
    [moveTask]
  );

  return {
    createTask,
    editTask,
    removeTask,
    moveTaskToColumn,
  };
};

