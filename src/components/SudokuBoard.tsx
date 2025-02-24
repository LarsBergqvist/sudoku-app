import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, selectCell, loadSavedGame, loadSavedGameState } from '../store/sudokuSlice'
import NumberSelector from './NumberSelector'
import GameControls from './GameControls'
import './SudokuBoard.css'
import { handleCellClick, handleBoardClick, handleNumberSelect, handleKeyDown } from './UserInteractionHandlers'

const SudokuBoard = () => {
  const dispatch = useAppDispatch()
  const { 
    board, 
    loading, 
    error, 
    isComplete, 
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

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, selectedCell, dispatch)
    window.addEventListener('keydown', keyDownHandler)
    return () => window.removeEventListener('keydown', keyDownHandler)
  }, [selectedCell, dispatch])

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
        <div className="board-background" onClick={(e) => handleBoardClick(e, dispatch)}>
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
                  onClick={(e) => handleCellClick(rowIndex, colIndex, e, initialBoard, selectedCell, dispatch, setSelectorPosition)}
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
          onSelect={(value) => handleNumberSelect(value, selectedCell, dispatch)}
          onClose={() => dispatch(selectCell(null))}
        />
      )}
      <GameControls />
    </div>
  )
}

export default SudokuBoard 