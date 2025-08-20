import { useCallback } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useOptimizedTaskOperations = () => {
  const { addTask, moveTask } = useKanbanStore();

  const createTask = useCallback(
    (
      title: string,
      description: string,
      columnId: 'todo' | 'in-progress' | 'done'
    ) => {
      addTask(title, description, columnId);
    },
    [addTask]
  );

  const moveTaskOptimized = useCallback(
    (taskId: string, fromStatus: string, toStatus: string) => {
      moveTask(taskId, fromStatus, toStatus);
    },
    [moveTask]
  );

  return {
    createTask,
    moveTask: moveTaskOptimized,
  };
};

