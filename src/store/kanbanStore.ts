import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Task, Column, TaskHistory, KanbanStore } from '../types';
import { LocalStorageService } from '../services/localStorageService';
import { generateId, getInitialColumns } from '../utils/helpers';

interface KanbanState {
  // State
  tasks: Task[];
  columns: Column[];
  taskHistory: TaskHistory[];
  draggedTaskId: string | null;

  // Actions
  addTask: (title: string, description?: string) => void;
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
}

export const useKanbanStore = create<KanbanState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        tasks: LocalStorageService.getTasks(),
        columns:
          LocalStorageService.getColumns().length > 0
            ? LocalStorageService.getColumns()
            : getInitialColumns(),
        taskHistory: LocalStorageService.getHistory(),
        draggedTaskId: null,

        // Actions
        addTask: (title: string, description?: string) => {
          const newTask: Task = {
            id: generateId(),
            title,
            description,
            status: 'todo',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => {
            const newTasks = [...state.tasks, newTask];
            const newColumns = state.columns.map((column) => {
              if (column.status === 'todo') {
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
              task.id === id
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
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
          set((state) => {
            const task = state.tasks.find((t) => t.id === id);
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
          const task = get().tasks.find((t) => t.id === id);
          if (task) {
            get().addToHistory('deleted', id, task.title);
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
            get().addToHistory(
              'moved',
              taskId,
              task.title,
              fromStatus,
              toStatus
            );
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
            const updatedColumns = state.columns.map((column) => {
              if (column.id === columnId) {
                const reorderedTasks = taskIds
                  .map((id) => column.tasks.find((t) => t.id === id))
                  .filter((task): task is Task => task !== undefined);
                return { ...column, tasks: reorderedTasks };
              }
              return column;
            });

            LocalStorageService.saveColumns(updatedColumns);
            return { columns: updatedColumns };
          });
        },
      }),
      {
        name: 'kanban-storage',
        partialize: (state) => ({
          tasks: state.tasks,
          columns: state.columns,
          taskHistory: state.taskHistory,
        }),
      }
    )
  )
);

