import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Task, Column, TaskHistory } from '../types';
import { LocalStorageService } from '../services/localStorageService';
import { generateId, getInitialColumns } from '../utils/helpers';

interface KanbanState {
  // State
  tasks: Task[];
  columns: Column[];
  taskHistory: TaskHistory[];
  draggedTaskId: string | null;
  filterQuery: string;
  showHistory: boolean;

  // Actions
  addTask: (
    title: string,
    description?: string,
    initialStatus?: Task['status']
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, fromStatus: string, toStatus: string) => void;
  addToHistory: (
    action: TaskHistory['action'],
    taskId: string,
    taskTitle: string,
    fromStatus?: string,
    toStatus?: string
  ) => void;
  setDraggedTask: (taskId: string | null) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  resetStore: () => void;
  setFilterQuery: (query: string) => void;
  toggleHistory: () => void;
}

export const useKanbanStore = create<KanbanState>()(
  devtools((set, get) => ({
    // Initial state
    tasks: LocalStorageService.getTasks(),
    columns:
      LocalStorageService.getColumns().length > 0
        ? LocalStorageService.getColumns()
        : getInitialColumns(),
    taskHistory: LocalStorageService.getHistory(),
    draggedTaskId: null,
    filterQuery: '',
    showHistory: false,

    // Actions
    addTask: (
      title: string,
      description?: string,
      initialStatus: Task['status'] = 'todo'
    ) => {
      const newTask: Task = {
        id: generateId(),
        title,
        description,
        status: initialStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        const newTasks = [...state.tasks, newTask];
        const newColumns = state.columns.map((column) => {
          if (column.status === initialStatus) {
            return { ...column, tasks: [...column.tasks, newTask] };
          }
          return column;
        });

        // Save to localStorage
        LocalStorageService.saveTasks(newTasks);
        LocalStorageService.saveColumns(newColumns);

        return {
          tasks: newTasks,
          columns: newColumns,
        };
      });

      // Add to history
      get().addToHistory('created', newTask.id, newTask.title);
    },

    updateTask: (id: string, updates: Partial<Task>) => {
      set((state) => {
        const updatedTasks = state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        );

        const updatedColumns = state.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));

        // Save to localStorage
        LocalStorageService.saveTasks(updatedTasks);
        LocalStorageService.saveColumns(updatedColumns);

        return {
          tasks: updatedTasks,
          columns: updatedColumns,
        };
      });

      // Add to history
      const task = get().tasks.find((t) => t.id === id);
      if (task) {
        get().addToHistory('edited', id, task.title);
      }
    },

    deleteTask: (id: string) => {
      // Get task for history before deletion
      const taskToDelete = get().tasks.find((t) => t.id === id);

      set((state) => {
        const newTasks = state.tasks.filter((t) => t.id !== id);
        const newColumns = state.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((t) => t.id !== id),
        }));

        // Save to localStorage
        LocalStorageService.saveTasks(newTasks);
        LocalStorageService.saveColumns(newColumns);

        return {
          tasks: newTasks,
          columns: newColumns,
        };
      });

      // Add to history
      if (taskToDelete) {
        get().addToHistory('deleted', id, taskToDelete.title);
      }
    },

    moveTask: (taskId: string, fromStatus: string, toStatus: string) => {
      set((state) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return state;

        const updatedTask = {
          ...task,
          status: toStatus as Task['status'],
          updatedAt: new Date(),
        };
        const updatedTasks = state.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        );

        const updatedColumns = state.columns.map((column) => {
          if (column.status === fromStatus) {
            return {
              ...column,
              tasks: column.tasks.filter((t) => t.id !== taskId),
            };
          }
          if (column.status === toStatus) {
            return { ...column, tasks: [...column.tasks, updatedTask] };
          }
          return column;
        });

        // Save to localStorage
        LocalStorageService.saveTasks(updatedTasks);
        LocalStorageService.saveColumns(updatedColumns);

        return {
          tasks: updatedTasks,
          columns: updatedColumns,
        };
      });

      // Add to history
      const task = get().tasks.find((t) => t.id === taskId);
      if (task) {
        get().addToHistory('moved', taskId, task.title, fromStatus, toStatus);
      }
    },

    addToHistory: (
      action: TaskHistory['action'],
      taskId: string,
      taskTitle: string,
      fromStatus?: string,
      toStatus?: string
    ) => {
      const historyItem: TaskHistory = {
        id: generateId(),
        action,
        taskId,
        taskTitle,
        fromStatus,
        toStatus,
        timestamp: new Date(),
      };

      set((state) => {
        const newHistory = [historyItem, ...state.taskHistory.slice(0, 4)]; // Keep only last 5
        LocalStorageService.saveHistory(newHistory);
        return { taskHistory: newHistory };
      });
    },

    setDraggedTask: (taskId: string | null) => {
      set({ draggedTaskId: taskId });
    },

    reorderTasks: (columnId: string, taskIds: string[]) => {
      set((state) => {
        const newColumns = state.columns.map((column) => {
          if (column.id === columnId) {
            // Reorder tasks based on the provided taskIds
            const reorderedTasks = taskIds
              .map((taskId) => column.tasks.find((task) => task.id === taskId))
              .filter(
                (task): task is NonNullable<typeof task> => task !== undefined
              );
            return { ...column, tasks: reorderedTasks };
          }
          return column;
        });

        return { columns: newColumns };
      });
    },

    setFilterQuery: (query: string) => {
      set({ filterQuery: query });
    },

    toggleHistory: () => {
      set((state) => ({ showHistory: !state.showHistory }));
    },

    // Add a reset function to clear localStorage and reset to initial state
    resetStore: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kanban-tasks');
        localStorage.removeItem('kanban-columns');
        localStorage.removeItem('kanban-history');
      }
      set(() => ({
        tasks: [],
        columns: getInitialColumns(),
        taskHistory: [],
        draggedTaskId: null,
        filterQuery: '',
        showHistory: false,
      }));
    },
  }))
);

