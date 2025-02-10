import React from 'react'
import { useState } from 'react'
import './App.css'
import SudokuBoard from './components/SudokuBoard'

function App() {
  return (
    <div className="App">
      <h1>Sudoku Game</h1>
      <SudokuBoard />
    </div>
  )
}

export default App 