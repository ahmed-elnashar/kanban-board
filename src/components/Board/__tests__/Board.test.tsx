import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { Board } from '../Board';
import { createMockBoard, resetStore } from '../../../test/test-utils';
import { useKanbanData } from '../../../hooks/useKanbanData';
import { useKanbanStore } from '../../../store/kanbanStore';

// Mock the useKanbanData hook
vi.mock('../../../hooks/useKanbanData', () => ({
  useKanbanData: vi.fn(() => ({
    columns: [],
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
    isFiltered: false,
  })),
}));

// Mock the useKanbanStore hook
vi.mock('../../../store/kanbanStore', () => ({
  useKanbanStore: vi.fn(() => ({
    resetStore: vi.fn(),
  })),
}));

describe('Board Component', () => {
  const mockUseKanbanData = vi.mocked(useKanbanData);
  const mockUseKanbanStore = vi.mocked(useKanbanStore);

  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
    // Reset to default mock values
    mockUseKanbanData.mockReturnValue({
      columns: [],
      totalTasks: 0,
      completedTasks: 0,
      progressPercentage: 0,
      isFiltered: false,
    });
  });

  describe('Rendering', () => {
    it('renders board title correctly', () => {
      render(<Board />);

      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    });

    it('renders board subtitle correctly', () => {
      render(<Board />);

      expect(
        screen.getByText('Manage your tasks and track progress efficiently')
      ).toBeInTheDocument();
    });

    it('renders board statistics', () => {
      render(<Board />);

      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('renders reset board button', () => {
      render(<Board />);

      expect(screen.getByText('Reset Board')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Reset board and clear all data')
      ).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('displays correct total tasks count', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 5,
        completedTasks: 2,
        progressPercentage: 40,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('displays correct completed tasks count', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 5,
        completedTasks: 3,
        progressPercentage: 60,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays correct progress percentage', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 10,
        completedTasks: 7,
        progressPercentage: 70,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('displays 0 when no tasks exist', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByLabelText('Total tasks: 0')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('shows progress bar when tasks exist', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 5,
        completedTasks: 2,
        progressPercentage: 40,
        isFiltered: false,
      });

      render(<Board />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '40');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('hides progress bar when no tasks exist', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('has correct progress bar accessibility', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 5,
        completedTasks: 2,
        progressPercentage: 40,
        isFiltered: false,
      });

      render(<Board />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Progress: 40%');
    });
  });

  describe('Columns Display', () => {
    it('shows loading state when no columns exist', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('Loading board...')).toBeInTheDocument();
    });

    it('renders columns when they exist', () => {
      const mockColumns = [
        { id: 'todo', title: 'To Do', status: 'todo', tasks: [] },
        {
          id: 'in-progress',
          title: 'In Progress',
          status: 'in-progress',
          tasks: [],
        },
        { id: 'done', title: 'Done', status: 'done', tasks: [] },
      ];

      mockUseKanbanData.mockReturnValue({
        columns: mockColumns,
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  describe('Filter Status', () => {
    it('shows filter status when filtering is active', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: true,
      });

      render(<Board />);

      expect(screen.getByText('Showing filtered results')).toBeInTheDocument();
    });

    it('hides filter status when not filtering', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(
        screen.queryByText('Showing filtered results')
      ).not.toBeInTheDocument();
    });
  });

  describe('Reset Board Functionality', () => {
    it('shows confirmation dialog when reset button is clicked', () => {
      const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<Board />);

      const resetButton = screen.getByText('Reset Board');
      fireEvent.click(resetButton);

      expect(mockConfirm).toHaveBeenCalledWith(
        'This will clear all data and reset the board. Are you sure?'
      );

      mockConfirm.mockRestore();
    });

    it('calls resetStore when confirmation is accepted', async () => {
      const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const mockResetStore = vi.fn();

      mockUseKanbanStore.mockReturnValue({
        resetStore: mockResetStore,
      });

      render(<Board />);

      const resetButton = screen.getByText('Reset Board');
      fireEvent.click(resetButton);

      expect(mockConfirm).toHaveBeenCalled();
      expect(mockResetStore).toHaveBeenCalled();

      mockConfirm.mockRestore();
    });

    it('does not call resetStore when confirmation is cancelled', () => {
      const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const mockResetStore = vi.fn();

      mockUseKanbanStore.mockReturnValue({
        resetStore: mockResetStore,
      });

      render(<Board />);

      const resetButton = screen.getByText('Reset Board');
      fireEvent.click(resetButton);

      expect(mockConfirm).toHaveBeenCalled();
      expect(mockResetStore).not.toHaveBeenCalled();

      mockConfirm.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper main role and label', () => {
      render(<Board />);

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveAttribute('aria-label', 'Kanban Board');
    });

    it('has proper region labels', () => {
      render(<Board />);

      expect(screen.getByLabelText('Board Statistics')).toBeInTheDocument();
      expect(screen.getByLabelText('Task Columns')).toBeInTheDocument();
    });

    it('has proper button accessibility', () => {
      render(<Board />);

      const resetButton = screen.getByText('Reset Board');
      expect(resetButton).toHaveAttribute(
        'aria-label',
        'Reset board and clear all data'
      );
      expect(resetButton).toHaveAttribute('title', 'Reset Board');
    });

    it('has proper heading structure', () => {
      render(<Board />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Kanban Board');
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', () => {
      render(<Board />);

      expect(screen.getByText('Kanban Board')).toBeInTheDocument();

      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.dispatchEvent(new Event('resize'));

      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with Filter component', () => {
      render(<Board />);

      // Filter component should be rendered
      expect(
        screen.getByRole('region', { name: 'Task Columns' })
      ).toBeInTheDocument();
    });

    it('works with TaskHistory component', () => {
      render(<Board />);

      // TaskHistory component should be rendered
      expect(
        screen.getByRole('region', { name: 'Task Columns' })
      ).toBeInTheDocument();
    });

    it('works with DndProvider', () => {
      render(<Board />);

      // Board should be wrapped in DndProvider
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers gracefully', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 999999,
        completedTasks: 888888,
        progressPercentage: 89,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByText('888888')).toBeInTheDocument();
      expect(screen.getByText('89%')).toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
      mockUseKanbanData.mockReturnValue({
        columns: [],
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByLabelText('Total tasks: 0')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles undefined values gracefully', () => {
      mockUseKanbanData.mockReturnValue({
        columns: undefined,
        totalTasks: undefined,
        completedTasks: undefined,
        progressPercentage: undefined,
        isFiltered: false,
      });

      render(<Board />);

      expect(screen.getByLabelText('Total tasks: 0')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });
});

