import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { Task } from '../Task';
import { createMockTask } from '../../../test/test-utils';

// Mock the useTaskOperations hook
vi.mock('../../../hooks/useTaskOperations', () => ({
  useTaskOperations: () => ({
    editTask: vi.fn(),
    removeTask: vi.fn(),
  }),
}));

describe('Task Component', () => {
  const mockTask = createMockTask({
    id: 'test-task-1',
    title: 'Test Task Title',
    description: 'Test task description',
  });

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders task title and description correctly', () => {
      render(<Task task={mockTask} />);

      expect(screen.getByText('Test Task Title')).toBeInTheDocument();
      expect(screen.getByText('Test task description')).toBeInTheDocument();
    });

    it('renders task without description when description is undefined', () => {
      const taskWithoutDescription = createMockTask({ description: undefined });
      render(<Task task={taskWithoutDescription} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(
        screen.queryByText('Test task description')
      ).not.toBeInTheDocument();
    });

    it('renders action buttons (edit and delete)', () => {
      render(<Task task={mockTask} />);

      expect(
        screen.getByLabelText('Edit task: Test Task Title')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Delete task: Test Task Title')
      ).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode when edit button is clicked', () => {
      render(<Task task={mockTask} />);

      const editButton = screen.getByLabelText('Edit task: Test Task Title');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('Test Task Title')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Test task description')
      ).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('updates title input when typing', () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      const titleInput = screen.getByDisplayValue('Test Task Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });

      expect(titleInput).toHaveValue('Updated Task Title');
    });

    it('updates description textarea when typing', () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      const descriptionTextarea = screen.getByDisplayValue(
        'Test task description'
      );
      fireEvent.change(descriptionTextarea, {
        target: { value: 'Updated description' },
      });

      expect(descriptionTextarea).toHaveValue('Updated description');
    });

    it('shows edit hint text', () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      expect(screen.getByText('Press Ctrl+Enter to save')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Task task={mockTask} />);

      expect(
        screen.getByLabelText('Task: Test Task Title')
      ).toBeInTheDocument();
    });

    it('has proper button labels', () => {
      render(<Task task={mockTask} />);

      expect(
        screen.getByLabelText('Edit task: Test Task Title')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Delete task: Test Task Title')
      ).toBeInTheDocument();
    });

    it('has proper form labels in edit mode', () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      expect(screen.getByLabelText('Task title')).toBeInTheDocument();
      expect(screen.getByLabelText('Task description')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Ctrl+Enter to save in title input', async () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      const titleInput = screen.getByDisplayValue('Test Task Title');
      fireEvent.keyDown(titleInput, { key: 'Enter', ctrlKey: true });

      // Should save and exit edit mode
      await waitFor(() => {
        expect(
          screen.queryByDisplayValue('Test Task Title')
        ).not.toBeInTheDocument();
      });
    });

    it('handles Escape to cancel in title input', async () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      const titleInput = screen.getByDisplayValue('Test Task Title');
      fireEvent.change(titleInput, { target: { value: 'Modified Title' } });
      fireEvent.keyDown(titleInput, { key: 'Escape' });

      // Should cancel and exit edit mode
      await waitFor(() => {
        expect(
          screen.queryByDisplayValue('Modified Title')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('has proper drag attributes when not editing', () => {
      render(<Task task={mockTask} />);

      const taskElement = screen.getByLabelText('Task: Test Task Title');
      // Check for drag-related attributes from @dnd-kit/sortable
      expect(taskElement).toHaveAttribute('aria-roledescription', 'sortable');
    });

    it('disables drag when in edit mode', () => {
      render(<Task task={mockTask} />);

      // Enter edit mode
      fireEvent.click(screen.getByLabelText('Edit task: Test Task Title'));

      const taskElement = screen.getByRole('article');
      expect(taskElement).toHaveAttribute(
        'aria-label',
        'Editing task: Test Task Title'
      );
    });
  });

  describe('Task States', () => {
    it('shows empty state when task has no description', () => {
      const taskWithoutDescription = createMockTask({ description: undefined });
      render(<Task task={taskWithoutDescription} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(
        screen.queryByText('Test task description')
      ).not.toBeInTheDocument();
    });

    it('handles long titles gracefully', () => {
      const longTitle =
        'This is a very long task title that should be handled properly by the component without breaking the layout or causing any visual issues';
      const taskWithLongTitle = createMockTask({ title: longTitle });

      render(<Task task={taskWithLongTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long descriptions gracefully', () => {
      const longDescription =
        'This is a very long task description that should be handled properly by the component. It might contain multiple sentences and should wrap correctly without breaking the layout or causing any visual issues. The component should handle this gracefully.';
      const taskWithLongDescription = createMockTask({
        description: longDescription,
      });

      render(<Task task={taskWithLongDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });
});

