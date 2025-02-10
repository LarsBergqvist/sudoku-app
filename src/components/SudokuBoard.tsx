import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, updateCell } from '../store/sudokuSlice'
import './SudokuBoard.css'

const SudokuBoard = () => {
  const dispatch = useAppDispatch()
  const { board, loading, error } = useAppSelector((state) => state.sudoku)

  useEffect(() => {
    dispatch(fetchNewPuzzle())
  }, [dispatch])

  const handleCellChange = (row: number, col: number, value: string) => {
    const newValue = value === '' ? 0 : parseInt(value)
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return

    dispatch(updateCell({ row, col, value: newValue }))
  }

  if (loading) {
    return <div>Loading puzzle...</div>
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchNewPuzzle())}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="sudoku-container">
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
      <button className="new-game-button" onClick={() => dispatch(fetchNewPuzzle())}>
        New Game
      </button>
    </div>
  )
}

export default SudokuBoard 