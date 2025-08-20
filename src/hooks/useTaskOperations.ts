import { useCallback } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useTaskOperations = () => {
  const { addTask, updateTask, deleteTask } = useKanbanStore();

  const createTask = useCallback(
    (title: string, description?: string) => {
      if (!title.trim()) return;
      addTask(title.trim(), description?.trim());
    },
    [addTask]
  );

  const editTask = useCallback(
    (id: string, updates: { title?: string; description?: string }) => {
      if (updates.title !== undefined && !updates.title.trim()) return;
      updateTask(id, updates);
    },
    [updateTask]
  );

  const removeTask = useCallback(
    (id: string) => {
      deleteTask(id);
    },
    [deleteTask]
  );

  return {
    createTask,
    editTask,
    removeTask,
  };
};

