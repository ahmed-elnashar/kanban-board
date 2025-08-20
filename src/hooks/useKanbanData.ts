import { useMemo } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useKanbanData = () => {
  const { columns, filterQuery } = useKanbanStore();

  // Filter tasks based on query
  const filteredColumns = useMemo(() => {
    if (!filterQuery.trim()) {
      return columns;
    }

    const query = filterQuery.toLowerCase();
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      ),
    }));
  }, [columns, filterQuery]);

  // Calculate stats from filtered data
  const totalTasks = useMemo(() => {
    return filteredColumns.reduce(
      (total, column) => total + column.tasks.length,
      0
    );
  }, [filteredColumns]);

  const completedTasks = useMemo(() => {
    const doneColumn = filteredColumns.find((col) => col.status === 'done');
    return doneColumn ? doneColumn.tasks.length : 0;
  }, [filteredColumns]);

  const progressPercentage = useMemo(() => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [totalTasks, completedTasks]);

  return {
    columns: filteredColumns,
    totalTasks,
    completedTasks,
    progressPercentage,
    isFiltered: filterQuery.trim().length > 0,
  };
};

