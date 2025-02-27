import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectCell } from '../store/sudokuSlice'
import NumberSelector from './NumberSelector'
import './SudokuBoard.css'
import useSudokuInteractions from '../hooks/useSudokuInteractions'

const SudokuBoard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { 
    puzzle, 
    incorrectCells, 
    selectedCell, 
    showingIncorrect,
    selectorPosition
  } = useAppSelector((state) => state.sudoku)
  const initialBoard = useAppSelector((state) => state.sudoku.initialBoard)

  const {
    handleCellClick,
    handleBoardClick,
    handleNumberSelect
  } = useSudokuInteractions()

  return (
    <div className="sudoku-board">
      <div className="board-background" onClick={handleBoardClick}>
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell 
                  ${showingIncorrect && incorrectCells[rowIndex][colIndex] ? 'incorrect' : ''}
                  ${puzzle[rowIndex][colIndex] !== 0 ? 'entered' : ''}
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
      {selectedCell && (
        <NumberSelector
          position={selectorPosition}
          onSelect={handleNumberSelect}
          onClose={() => dispatch(selectCell(null))}
        />
      )}
    </div>
  )
}

export default SudokuBoard 