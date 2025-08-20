import { useKanbanStore } from '../store/kanbanStore';
import { useMemo } from 'react';

export const useKanbanData = () => {
  const tasks = useKanbanStore((state) => state.tasks);
  const columns = useKanbanStore((state) => state.columns);
  const taskHistory = useKanbanStore((state) => state.taskHistory);
  const draggedTaskId = useKanbanStore((state) => state.draggedTaskId);

  const tasksByStatus = useMemo(() => {
    const grouped = {
      todo: tasks.filter((task) => task.status === 'todo'),
      'in-progress': tasks.filter((task) => task.status === 'in-progress'),
      done: tasks.filter((task) => task.status === 'done'),
    };
    return grouped;
  }, [tasks]);

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === 'done').length,
    [tasks]
  );
  const progressPercentage = useMemo(() => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [totalTasks, completedTasks]);

  return {
    tasks,
    columns,
    taskHistory,
    draggedTaskId,
    tasksByStatus,
    totalTasks,
    completedTasks,
    progressPercentage,
  };
};

