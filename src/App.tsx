import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameBoard />
      </header>
    </div>
  );
}

export default App;
