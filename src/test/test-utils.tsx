import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { DndProvider } from '../components/DndProvider/DndProvider';
import type { Task, Column } from '../types';

// Custom render function that includes DndProvider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <DndProvider>{children}</DndProvider>;
};

// Custom render function that doesn't include DndProvider (for components that don't need it)
const customRenderWithoutDnd = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Test data helpers
export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'test-task-1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockColumn = (overrides: Partial<Column> = {}): Column => ({
  id: 'test-column-1',
  title: 'To Do',
  status: 'todo',
  tasks: [],
  ...overrides,
});

export const createMockBoard = () => ({
  columns: [
    createMockColumn({ id: 'todo', title: 'To Do', status: 'todo' }),
    createMockColumn({
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
    }),
    createMockColumn({ id: 'done', title: 'Done', status: 'done' }),
  ],
  tasks: [
    createMockTask({ id: 'task-1', status: 'todo' }),
    createMockTask({ id: 'task-2', status: 'in-progress' }),
    createMockTask({ id: 'task-3', status: 'done' }),
  ],
});

// Store helpers
export const resetStore = () => {
  // For tests, we'll just clear localStorage manually
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kanban-tasks');
    localStorage.removeItem('kanban-columns');
    localStorage.removeItem('kanban-history');
  }
};

export const setStoreData = (columns: Column[], tasks: Task[]) => {
  // For tests, we'll mock the store data by setting localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, customRenderWithoutDnd };

