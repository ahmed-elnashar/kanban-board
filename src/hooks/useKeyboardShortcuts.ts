import { useEffect } from 'react';
import { useKanbanStore } from '../store/kanbanStore';

export const useKeyboardShortcuts = () => {
  const { setFilterQuery, toggleHistory } = useKanbanStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + K: Focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search tasks"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + H: Toggle history
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        toggleHistory();
      }

      // Escape: Clear search
      if (event.key === 'Escape') {
        const searchInput = document.querySelector(
          'input[placeholder*="Search tasks"]'
        ) as HTMLInputElement;
        if (searchInput && searchInput.value) {
          setFilterQuery('');
          searchInput.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setFilterQuery, toggleHistory]);
};

