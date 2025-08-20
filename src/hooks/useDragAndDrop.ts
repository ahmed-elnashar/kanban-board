import { useCallback } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useDragAndDrop = () => {
  const { moveTask, reorderTasks, setDraggedTask } = useKanbanStore();

  const handleDragStart = useCallback(
    (taskId: string) => {
      setDraggedTask(taskId);
    },
    [setDraggedTask]
  );

  const handleDragEnd = useCallback(
    (taskId: string, fromStatus: string, toStatus: string) => {
      setDraggedTask(null);

      if (fromStatus !== toStatus) {
        moveTask(taskId, fromStatus, toStatus);
      }
    },
    [moveTask, setDraggedTask]
  );

  const handleDragOver = useCallback((taskId: string, toStatus: string) => {
    // This can be used for visual feedback during drag
  }, []);

  const handleReorder = useCallback(
    (columnId: string, taskIds: string[]) => {
      reorderTasks(columnId, taskIds);
    },
    [reorderTasks]
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleReorder,
  };
};

