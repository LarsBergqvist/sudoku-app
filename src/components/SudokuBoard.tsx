import React, { useState, useEffect } from 'react'
import './SudokuBoard.css'

const SudokuBoard = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const parseGridString = (gridString: string): number[][] => {
    const grid: number[][] = []
    for (let i = 0; i < 9; i++) {
      const row: number[] = []
      for (let j = 0; j < 9; j++) {
        const char = gridString[i * 9 + j]
        row.push(char === ' ' || char === '.' ? 0 : parseInt(char))
      }
      grid.push(row)
    }
    return grid
  }

  useEffect(() => {
    fetchNewPuzzle()
  }, [])

  const fetchNewPuzzle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/Sudoku?dificulty=basic')
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle')
      }
      const data = await response.json()
      const parsedGrid = parseGridString(data.grid)
      setBoard(parsedGrid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle')
    } finally {
      setLoading(false)
    }
  }

  const handleCellChange = (row: number, col: number, value: string) => {
    const newValue = value === '' ? 0 : parseInt(value)
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = newValue
    setBoard(newBoard)
  }

  if (loading) {
    return <div>Loading puzzle...</div>
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchNewPuzzle}>Try Again</button>
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
      <button className="new-game-button" onClick={fetchNewPuzzle}>
        New Game
      </button>
    </div>
  )
}

export default SudokuBoard 