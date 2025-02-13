import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, updateCell, undo, type Difficulty } from '../store/sudokuSlice'
import NumberSelector from './NumberSelector'
import './SudokuBoard.css'

interface CellPosition {
  row: number
  col: number
}

const SudokuBoard = () => {
  const dispatch = useAppDispatch()
  const { board, loading, error, isComplete, history, incorrectCells } = useAppSelector((state) => state.sudoku)
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null)
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 })
  const [initialBoard, setInitialBoard] = useState<number[][]>([])

  useEffect(() => {
    dispatch(fetchNewPuzzle('Basic'))
  }, [dispatch])

  useEffect(() => {
    if (!loading && board.length > 0) {
      setInitialBoard(board.map(row => [...row]))
    }
  }, [loading])

  const handleCellClick = (row: number, col: number, event: React.MouseEvent<HTMLDivElement>) => {
    // Only prevent clicking if it's an initial board cell
    if (initialBoard[row]?.[col] !== 0) {
      return
    }
  
    const cellElement = event.currentTarget
    const rect = cellElement.getBoundingClientRect()
    
    setSelectedCell({ row, col })
    setSelectorPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })
  }

  const handleNumberSelect = (value: number) => {
    if (selectedCell) {
      dispatch(updateCell({ 
        row: selectedCell.row, 
        col: selectedCell.col, 
        value 
      }))
    }
    setSelectedCell(null)
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
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell 
                  ${incorrectCells[rowIndex][colIndex] ? 'incorrect' : ''} 
                  ${initialBoard[rowIndex]?.[colIndex] !== 0 ? 'initial' : ''}`}
                onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedCell && (
        <NumberSelector
          position={selectorPosition}
          onSelect={handleNumberSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
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