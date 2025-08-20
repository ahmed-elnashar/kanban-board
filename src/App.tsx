import React from 'react';
import './App.css';
import { Board } from './components/Board/Board';
import { KeyboardShortcuts } from './components/KeyboardShortcuts/KeyboardShortcuts';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="app">
      {/* Skip link for accessibility */}
      <a href="#board" className="skip-link">
        Skip to main content
      </a>

      {/* Main Content Area */}
      <div className="content-area">
        <Board />
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts />
    </div>
  );
}

export default App;

