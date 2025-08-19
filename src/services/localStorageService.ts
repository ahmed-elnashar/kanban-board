import { Task, Column, TaskHistory } from '../types';

const STORAGE_KEYS = {
  TASKS: 'kanban-tasks',
  COLUMNS: 'kanban-columns',
  HISTORY: 'kanban-history',
} as const;

export class LocalStorageService {
  static getTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!stored) return [];

      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  static getColumns(): Column[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COLUMNS);
      if (!stored) return [];

      const columns = JSON.parse(stored);
      return columns.map((column: any) => ({
        ...column,
        tasks: column.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        })),
      }));
    } catch (error) {
      console.error('Error loading columns from localStorage:', error);
      return [];
    }
  }

  static saveColumns(columns: Column[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
    } catch (error) {
      console.error('Error saving columns to localStorage:', error);
    }
  }

  static getHistory(): TaskHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!stored) return [];

      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      return [];
    }
  }

  static saveHistory(history: TaskHistory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.COLUMNS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

