import React from 'react';
import './App.css';
import { Board } from './components/Board/Board';

function App() {
  return (
    <div className="app">
      {/* Main Content Area */}
      <div className="content-area">
        <Board />
      </div>
    </div>
  );
}

export default App;

