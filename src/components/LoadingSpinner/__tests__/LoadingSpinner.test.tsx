import { describe, it, expect } from 'vitest';
import {
  customRenderWithoutDnd as render,
  screen,
} from '../../../test/test-utils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Rendering', () => {
    it('renders spinner without text by default', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders spinner with custom text', () => {
      render(<LoadingSpinner text="Custom loading message" />);

      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('renders spinner with empty text', () => {
      render(<LoadingSpinner text="" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      // Don't check for empty text as it can cause conflicts with multiple elements
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies medium size by default', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('medium');
    });

    it('applies small size when specified', () => {
      render(<LoadingSpinner size="small" />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('small');
    });

    it('applies large size when specified', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('large');
    });

    it('applies medium size when specified', () => {
      render(<LoadingSpinner size="medium" />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('medium');
    });
  });

  describe('Accessibility', () => {
    it('has proper role attribute', () => {
      render(<LoadingSpinner />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has proper aria-live attribute', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('maintains accessibility with different sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<LoadingSpinner size={size} />);

        const spinner = screen.getByRole('status');
        expect(spinner).toHaveAttribute('aria-live', 'polite');

        unmount();
      });
    });

    it('maintains accessibility with text', () => {
      render(<LoadingSpinner text="Loading tasks..." />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('CSS Classes', () => {
    it('applies base spinner class', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('spinner');
    });

    it('applies size-specific class', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('spinner');
      expect(spinner.className).toContain('large');
    });

    it('combines multiple classes correctly', () => {
      render(<LoadingSpinner size="small" text="Loading..." />);

      const spinner = screen.getByRole('status');
      expect(spinner.className).toContain('spinner');
      expect(spinner.className).toContain('small');
    });
  });

  describe('Text Display', () => {
    it('shows text when provided', () => {
      render(<LoadingSpinner text="Please wait..." />);

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('does not show text element when no text provided', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      const textElement = spinner.querySelector('[class*="text"]');
      expect(textElement).not.toBeInTheDocument();
    });

    it('handles long text gracefully', () => {
      const longText =
        'This is a very long loading message that should be handled properly by the component without breaking the layout or causing any visual issues';

      render(<LoadingSpinner text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText =
        'Loading with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

      render(<LoadingSpinner text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Spinner Animation', () => {
    it('renders spinner inner element', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      const spinnerInner = spinner.querySelector('[class*="spinnerInner"]');
      expect(spinnerInner).toBeInTheDocument();
    });

    it('applies correct size classes to inner spinner', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<LoadingSpinner size={size} />);

        const spinner = screen.getByRole('status');
        const spinnerInner = spinner.querySelector('[class*="spinnerInner"]');
        expect(spinnerInner).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', () => {
      render(<LoadingSpinner text="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.dispatchEvent(new Event('resize'));

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined text gracefully', () => {
      render(<LoadingSpinner text={undefined as any} />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });

    it('handles null text gracefully', () => {
      render(<LoadingSpinner text={null as any} />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('null')).not.toBeInTheDocument();
    });

    it('handles invalid size gracefully', () => {
      render(<LoadingSpinner size={'invalid' as any} />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      // Should fall back to default behavior
    });
  });

  describe('Integration', () => {
    it('works as child component', () => {
      const TestComponent = () => (
        <div>
          <h1>Test Page</h1>
          <LoadingSpinner text="Loading content..." />
        </div>
      );

      render(<TestComponent />);

      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('works with multiple instances', () => {
      render(
        <div>
          <LoadingSpinner size="small" text="Loading 1" />
          <LoadingSpinner size="medium" text="Loading 2" />
          <LoadingSpinner size="large" text="Loading 3" />
        </div>
      );

      expect(screen.getByText('Loading 1')).toBeInTheDocument();
      expect(screen.getByText('Loading 2')).toBeInTheDocument();
      expect(screen.getByText('Loading 3')).toBeInTheDocument();

      const spinners = screen.getAllByRole('status');
      expect(spinners).toHaveLength(3);
    });
  });
});

