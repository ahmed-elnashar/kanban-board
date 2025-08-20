import { useCallback } from 'react';
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { useKanbanStore } from '../store/kanbanStore';
import type { Task } from '../types';

export const useDragAndDrop = () => {
  const { moveTask, reorderTasks, setDraggedTask } = useKanbanStore();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setDraggedTask(active.id as string);
    },
    [setDraggedTask]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    if (!over) return;

    const overId = over.id as string;

    // If dropping on a column, we'll handle it in drag end
    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      return;
    }

    // If dropping on a task, we'll handle it in drag end
    return;
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setDraggedTask(null);
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      // Reset dragged task
      setDraggedTask(null);

      // If dropping on a column, move the task to that column
      if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
        const targetStatus = overId as Task['status'];

        // Find the current status of the task
        const { columns } = useKanbanStore.getState();
        let currentStatus: Task['status'] | null = null;

        for (const column of columns) {
          if (column.tasks.some((task) => task.id === activeId)) {
            currentStatus = column.status;
            break;
          }
        }

        if (currentStatus && currentStatus !== targetStatus) {
          moveTask(activeId, currentStatus, targetStatus);
        }
        return;
      }

      // If dropping on a task, reorder within the same column
      const { columns } = useKanbanStore.getState();
      let sourceColumn: (typeof columns)[0] | null = null;
      let targetColumn: (typeof columns)[0] | null = null;

      // Find source and target columns
      for (const column of columns) {
        if (column.tasks.some((task) => task.id === activeId)) {
          sourceColumn = column;
        }
        if (column.tasks.some((task) => task.id === overId)) {
          targetColumn = column;
        }
      }

      if (!sourceColumn || !targetColumn) return;

      // If same column, reorder tasks
      if (sourceColumn.id === targetColumn.id) {
        const taskIds = sourceColumn.tasks.map((task) => task.id);
        const activeIndex = taskIds.indexOf(activeId);
        const overIndex = taskIds.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newTaskIds = [...taskIds];
          newTaskIds.splice(activeIndex, 1);
          newTaskIds.splice(overIndex, 0, activeId);
          reorderTasks(sourceColumn.id, newTaskIds);
        }
      } else {
        // Different columns - move task and reorder
        moveTask(activeId, sourceColumn.status, targetColumn.status);

        // Don't reorder here as moveTask already handles the positioning
        // The task will be added to the end of the target column
      }
    },
    [moveTask, reorderTasks, setDraggedTask]
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

