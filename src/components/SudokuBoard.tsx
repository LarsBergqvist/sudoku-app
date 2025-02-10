import React, { useState } from 'react'
import './SudokuBoard.css'

const SudokuBoard = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  )

  const handleCellChange = (row: number, col: number, value: string) => {
    const newValue = value === '' ? 0 : parseInt(value)
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = newValue
    setBoard(newBoard)
  }

  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
              className="cell"
              maxLength={1}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default SudokuBoard 