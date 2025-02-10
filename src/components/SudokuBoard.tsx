import  { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, updateCell, undo, type Difficulty } from '../store/sudokuSlice'
import './SudokuBoard.css'

const SudokuBoard = () => {
  const dispatch = useAppDispatch()
  const { board, loading, error, isComplete, history } = useAppSelector((state) => state.sudoku)

  useEffect(() => {
    dispatch(fetchNewPuzzle('Basic'))
  }, [dispatch])

  const handleCellChange = (row: number, col: number, value: string) => {
    const newValue = value === '' ? 0 : parseInt(value)
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return

    dispatch(updateCell({ row, col, value: newValue }))
  }

  const handleNewGame = (difficulty: Difficulty) => {
    dispatch(fetchNewPuzzle(difficulty))
  }

  if (loading) {
    return <div>Loading puzzle...</div>
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchNewPuzzle('Basic'))}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="sudoku-container">
      {isComplete && (
        <div className="victory-message">
          🎉 Congratulations! You've solved the puzzle! 🎉
        </div>
      )}
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
      <div className="game-controls">
        <button 
          className="undo-button" 
          onClick={() => dispatch(undo())}
          disabled={history.length === 0}
        >
          ↩ Undo
        </button>
        <div className="difficulty-buttons">
          <button 
            className="new-game-button basic" 
            onClick={() => handleNewGame('Basic')}
          >
            New Basic Game
          </button>
          <button 
            className="new-game-button hard" 
            onClick={() => handleNewGame('Hard')}
          >
            New Hard Game
          </button>
          <button 
            className="new-game-button very-hard" 
            onClick={() => handleNewGame('VeryHard')}
          >
            New Very Hard Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default SudokuBoard 