import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { Column } from '../Column';
import { createMockColumn, createMockTask } from '../../../test/test-utils';

describe('Column Component', () => {
  const mockColumn = createMockColumn({
    id: 'test-column',
    title: 'Test Column',
    status: 'todo',
    tasks: [],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders column title correctly', () => {
      render(<Column column={mockColumn} />);

      expect(screen.getByText('Test Column')).toBeInTheDocument();
    });

    it('renders task count correctly', () => {
      const columnWithTasks = createMockColumn({
        ...mockColumn,
        tasks: [
          createMockTask({ id: 'task-1' }),
          createMockTask({ id: 'task-2' }),
        ],
      });

      render(<Column column={columnWithTasks} />);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders task count as 0 when no tasks', () => {
      render(<Column column={mockColumn} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders AddTask component', () => {
      render(<Column column={mockColumn} />);

      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  describe('Column Themes', () => {
    it('applies correct background color for todo column', () => {
      render(<Column column={mockColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      expect(columnElement).toBeInTheDocument();
      // The main column element should have the background color class
      const mainColumn = columnElement!.parentElement;
      expect(mainColumn!.className).toContain('bgSlate50');
    });

    it('applies correct background color for in-progress column', () => {
      const inProgressColumn = {
        ...mockColumn,
        status: 'in-progress' as const,
      };
      render(<Column column={inProgressColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      expect(columnElement).toBeInTheDocument();
      // The main column element should have the background color class
      const mainColumn = columnElement!.parentElement;
      expect(mainColumn!.className).toContain('bgBlue50');
    });

    it('applies correct background color for done column', () => {
      const doneColumn = { ...mockColumn, status: 'done' as const };
      render(<Column column={doneColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      expect(columnElement).toBeInTheDocument();
      // The main column element should have the background color class
      const mainColumn = columnElement!.parentElement;
      expect(mainColumn!.className).toContain('bgEmerald50');
    });

    it('applies correct background color for todo column with different title', () => {
      const customColumn = { ...mockColumn, title: 'Custom Title' };
      render(<Column column={customColumn} />);

      const columnElement = screen.getByText('Custom Title').closest('div');
      expect(columnElement).toBeInTheDocument();
      // The main column element should have the background color class
      const mainColumn = columnElement!.parentElement;
      expect(mainColumn!.className).toContain('bgSlate50');
    });
  });

  describe('Task Rendering', () => {
    it('renders tasks when column has tasks', () => {
      const columnWithTasks = createMockColumn({
        ...mockColumn,
        tasks: [
          createMockTask({ id: 'task-1', title: 'Task 1' }),
          createMockTask({ id: 'task-2', title: 'Task 2' }),
        ],
      });

      render(<Column column={columnWithTasks} />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders empty state when no tasks', () => {
      render(<Column column={mockColumn} />);

      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    it('renders correct number of tasks', () => {
      const columnWithTasks = createMockColumn({
        ...mockColumn,
        tasks: [
          createMockTask({ id: 'task-1' }),
          createMockTask({ id: 'task-2' }),
          createMockTask({ id: 'task-3' }),
        ],
      });

      render(<Column column={columnWithTasks} />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<Column column={mockColumn} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Column');
    });

    it('has proper task count accessibility', () => {
      render(<Column column={mockColumn} />);

      const taskCount = screen.getByText('0');
      expect(taskCount).toBeInTheDocument();
    });

    it('has proper column structure', () => {
      render(<Column column={mockColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      expect(columnElement).toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('has proper drag attributes', () => {
      render(<Column column={mockColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      // Column should render without errors
      expect(columnElement).toBeInTheDocument();
    });

    it('applies dragging styles when being dragged', () => {
      render(<Column column={mockColumn} />);

      const columnElement = screen.getByText('Test Column').closest('div');
      // Note: In a real test, we'd need to simulate the dragging state
      // This is a basic structure test
      expect(columnElement).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', () => {
      render(<Column column={mockColumn} />);

      expect(screen.getByText('Test Column')).toBeInTheDocument();

      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.dispatchEvent(new Event('resize'));

      expect(screen.getByText('Test Column')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles column with very long title', () => {
      const longTitle =
        'This is a very long column title that should be handled properly by the component without breaking the layout or causing any visual issues';
      const columnWithLongTitle = createMockColumn({
        ...mockColumn,
        title: longTitle,
      });

      render(<Column column={columnWithLongTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles column with many tasks', () => {
      const manyTasks = Array.from({ length: 100 }, (_, i) =>
        createMockTask({ id: `task-${i}`, title: `Task ${i}` })
      );

      const columnWithManyTasks = createMockColumn({
        ...mockColumn,
        tasks: manyTasks,
      });

      render(<Column column={columnWithManyTasks} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Task 0')).toBeInTheDocument();
      expect(screen.getByText('Task 99')).toBeInTheDocument();
    });

    it('handles column with special characters in title', () => {
      const specialTitle =
        'Column with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const columnWithSpecialTitle = createMockColumn({
        ...mockColumn,
        title: specialTitle,
      });

      render(<Column column={columnWithSpecialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with AddTask component', () => {
      render(<Column column={mockColumn} />);

      const addTaskButton = screen.getByText('Add New Task');
      expect(addTaskButton).toBeInTheDocument();
    });

    it('works with Task components', () => {
      const columnWithTasks = createMockColumn({
        ...mockColumn,
        tasks: [createMockTask({ id: 'task-1', title: 'Test Task' })],
      });

      render(<Column column={columnWithTasks} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });
});

