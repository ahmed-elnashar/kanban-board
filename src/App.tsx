import React from 'react';
import './App.css';
import { Board } from './components/Board/Board';
import { KeyboardShortcuts } from './components/KeyboardShortcuts/KeyboardShortcuts';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="app">
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

