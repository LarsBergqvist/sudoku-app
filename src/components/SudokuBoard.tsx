import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, updateCell, undo, type Difficulty, selectCell, loadSavedGame, loadSavedGameState, setShowingIncorrect } from '../store/sudokuSlice'
import NumberSelector from './NumberSelector'
import './SudokuBoard.css'

const SudokuBoard = () => {
  const dispatch = useAppDispatch()
  const { 
    board, 
    loading, 
    error, 
    isComplete, 
    history, 
    incorrectCells, 
    selectedCell, 
    showingIncorrect 
  } = useAppSelector((state) => state.sudoku)
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 })
  const initialBoard = useAppSelector((state) => state.sudoku.initialBoard)

  useEffect(() => {
    const savedGame = loadSavedGame()
    if (savedGame) {
      dispatch(loadSavedGameState(savedGame))
    } else {
      dispatch(fetchNewPuzzle('Basic'))
    }
  }, [dispatch])

  const handleCellClick = (row: number, col: number, event: React.MouseEvent<HTMLDivElement>) => {
    // Check if initialBoard is defined and the cell is not editable
    if (initialBoard && initialBoard[row]?.[col] !== 0) {
      dispatch(selectCell(null))
      return
    }

    // Get the position of the clicked cell for the number selector
    const cellElement = event.currentTarget
    const rect = cellElement.getBoundingClientRect()
    setSelectorPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })

    // If clicking the same cell that's already selected, deselect it
    if (selectedCell?.row === row && selectedCell?.col === col) {
      dispatch(selectCell(null))
    } else {
      // Otherwise, select the new cell
      dispatch(selectCell({ row, col }))
    }
  }

  const handleBoardClick = (e: React.MouseEvent) => {
    // If clicking outside the cells (on the board background),
    // deselect the current cell
    if ((e.target as HTMLElement).classList.contains('board-background')) {
      dispatch(selectCell(null))
    }
  }

  const handleNumberSelect = (value: number) => {
    if (selectedCell) {
      dispatch(updateCell({ 
        row: selectedCell.row, 
        col: selectedCell.col, 
        value 
      }))
    }
    dispatch(selectCell(null))
  }

  const handleNewGame = (difficulty: Difficulty) => {
    dispatch(fetchNewPuzzle(difficulty))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) dispatch(selectCell({ row: row - 1, col }))
        break
      case 'ArrowDown':
        if (row < 8) dispatch(selectCell({ row: row + 1, col }))
        break
      case 'ArrowLeft':
        if (col > 0) dispatch(selectCell({ row, col: col - 1 }))
        break
      case 'ArrowRight':
        if (col < 8) dispatch(selectCell({ row, col: col + 1 }))
        break
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        handleNumberSelect(parseInt(e.key))
        break
      case 'Backspace':
      case 'Delete':
        handleNumberSelect(0)
        break
      case 'Escape':
        dispatch(selectCell(null))
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell])

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
        <div className="board-background" onClick={handleBoardClick}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell 
                    ${showingIncorrect && incorrectCells[rowIndex][colIndex] ? 'incorrect' : ''}
                    ${board[rowIndex][colIndex] !== 0 ? 'entered' : ''}
                    ${initialBoard && initialBoard[rowIndex][colIndex] !== 0 ? 'initial' : ''}
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''}
                    `}
                  onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                >
                  {cell !== 0 && cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {selectedCell && (
        <NumberSelector
          position={selectorPosition}
          onSelect={handleNumberSelect}
          onClose={() => dispatch(selectCell(null))}
        />
      )}
      <div className="game-controls">
        <div className="button-row">
          <button 
            className="show-incorrect-button"
            onMouseDown={() => dispatch(setShowingIncorrect(true))}
            onMouseUp={() => dispatch(setShowingIncorrect(false))}
            onMouseLeave={() => dispatch(setShowingIncorrect(false))}
            onTouchStart={() => dispatch(setShowingIncorrect(true))}
            onTouchEnd={() => dispatch(setShowingIncorrect(false))}
          >
            Show incorrect
          </button>
          <button 
            className="undo-button" 
            onClick={() => dispatch(undo())}
            disabled={history.length === 0}
          >
            ↩ Undo
          </button>
        </div>
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