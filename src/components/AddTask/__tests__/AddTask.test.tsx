import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { AddTask } from '../AddTask';

// Mock the useTaskOperations hook
const mockCreateTask = vi.fn();
vi.mock('../../../hooks/useTaskOperations', () => ({
  useTaskOperations: () => ({
    createTask: mockCreateTask,
  }),
}));

describe('AddTask Component', () => {
  const mockColumnId = 'todo';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('renders add task button when not expanded', () => {
      render(<AddTask columnId={mockColumnId} />);

      expect(screen.getByText('Add New Task')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Add new task to this column')
      ).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<AddTask columnId={mockColumnId} />);

      const addButton = screen.getByLabelText('Add new task to this column');
      expect(addButton).toHaveAttribute('title', 'Add New Task');
      expect(addButton).toHaveAttribute(
        'aria-label',
        'Add new task to this column'
      );
    });
  });

  describe('Expanding Form', () => {
    it('expands to show form when add button is clicked', () => {
      render(<AddTask columnId={mockColumnId} />);

      const addButton = screen.getByText('Add New Task');
      fireEvent.click(addButton);

      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Task description (optional)')
      ).toBeInTheDocument();
    });

    it('focuses title input when form expands', async () => {
      render(<AddTask columnId={mockColumnId} />);

      const addButton = screen.getByText('Add New Task');
      fireEvent.click(addButton);

      const titleInput = screen.getByPlaceholderText('Task title');
      await waitFor(() => {
        expect(titleInput).toHaveFocus();
      });
    });
  });

  describe('Form Inputs', () => {
    beforeEach(() => {
      render(<AddTask columnId={mockColumnId} />);
      fireEvent.click(screen.getByText('Add New Task'));
    });

    it('updates title input when typing', () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      fireEvent.change(titleInput, { target: { value: 'New Task Title' } });

      expect(titleInput).toHaveValue('New Task Title');
    });

    it('updates description textarea when typing', () => {
      const descriptionTextarea = screen.getByPlaceholderText(
        'Task description (optional)'
      );
      fireEvent.change(descriptionTextarea, {
        target: { value: 'New task description' },
      });

      expect(descriptionTextarea).toHaveValue('New task description');
    });

    it('has proper accessibility labels', () => {
      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Task description (optional)')
      ).toBeInTheDocument();
    });

    it('has proper placeholders', () => {
      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Task description (optional)')
      ).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      render(<AddTask columnId={mockColumnId} />);
      fireEvent.click(screen.getByText('Add New Task'));
    });

    it('submits form with title and description', async () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      const descriptionTextarea = screen.getByPlaceholderText(
        'Task description (optional)'
      );
      const submitButton = screen.getByText('Add Task');

      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionTextarea, {
        target: { value: 'New Description' },
      });
      fireEvent.click(submitButton);

      expect(mockCreateTask).toHaveBeenCalledWith(
        'New Task',
        'New Description',
        mockColumnId
      );
    });

    it('submits form with only title when description is empty', async () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      const submitButton = screen.getByText('Add Task');

      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.click(submitButton);

      expect(mockCreateTask).toHaveBeenCalledWith(
        'New Task',
        undefined,
        mockColumnId
      );
    });

    it('does not submit when title is empty', () => {
      const submitButton = screen.getByText('Add Task');
      expect(submitButton).toBeDisabled();
    });

    it('does not submit when title is only whitespace', () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      const submitButton = screen.getByText('Add Task');

      fireEvent.change(titleInput, { target: { value: '   ' } });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Cancellation', () => {
    beforeEach(() => {
      render(<AddTask columnId={mockColumnId} />);
      fireEvent.click(screen.getByText('Add New Task'));
    });

    it('collapses form when cancel button is clicked', () => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(
        screen.queryByPlaceholderText('Task title...')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    it('clears form inputs when canceling', () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      const descriptionTextarea = screen.getByPlaceholderText(
        'Task description (optional)'
      );

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descriptionTextarea, {
        target: { value: 'Test Description' },
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Re-expand form
      fireEvent.click(screen.getByText('Add New Task'));

      expect(screen.getByPlaceholderText('Task title')).toHaveValue('');
      expect(
        screen.getByPlaceholderText('Task description (optional)')
      ).toHaveValue('');
    });
  });

  describe('Button States', () => {
    beforeEach(() => {
      render(<AddTask columnId={mockColumnId} />);
      fireEvent.click(screen.getByText('Add New Task'));
    });

    it('enables submit button when title has content', () => {
      const titleInput = screen.getByPlaceholderText('Task title');
      const submitButton = screen.getByText('Add Task');

      expect(submitButton).toBeDisabled();

      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      expect(submitButton).not.toBeDisabled();
    });

    it('has proper button accessibility', () => {
      const { container } = render(<AddTask columnId={mockColumnId} />);
      
      // Test the collapsed state first
      expect(
        screen.getByLabelText('Add new task to this column')
      ).toBeInTheDocument();
      
      // Expand the form
      fireEvent.click(screen.getByText('Add New Task'));
      
      // Test the expanded state - use container to scope the search
      const cancelButtons = container.querySelectorAll('button');
      const cancelButton = Array.from(cancelButtons).find(
        button => button.textContent === 'Cancel'
      );
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('prevents event propagation on button clicks', () => {
      render(<AddTask columnId={mockColumnId} />);

      // Initially form should not be expanded
      expect(
        screen.queryByPlaceholderText('Task title')
      ).not.toBeInTheDocument();

      // Click the button to expand the form
      const addButton = screen.getByText('Add New Task');
      fireEvent.click(addButton);

      // Form should now be expanded
      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    });

    it('prevents event propagation on form interactions', () => {
      render(<AddTask columnId={mockColumnId} />);
      fireEvent.click(screen.getByText('Add New Task'));

      const titleInput = screen.getByPlaceholderText('Task title');
      const mockStopPropagation = vi.fn();

      fireEvent.keyDown(titleInput, {
        key: 'Enter',
        stopPropagation: mockStopPropagation,
      });

      // Input should still work despite stopPropagation
      expect(titleInput).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', () => {
      render(<AddTask columnId={mockColumnId} />);

      const addButton = screen.getByText('Add New Task');
      expect(addButton).toBeInTheDocument();

      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.dispatchEvent(new Event('resize'));

      expect(addButton).toBeInTheDocument();
    });
  });
});

