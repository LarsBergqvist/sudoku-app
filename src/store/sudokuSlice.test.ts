import { describe, it, expect } from 'vitest'
import sudokuReducer, { updateCell, SudokuState } from './sudokuSlice'
import { createZeroedSudokuMatrix, createClearedIncorrectcellsMatrix } from '../utils/sudokuFunctions'

describe('sudokuSlice', () => {
  describe('updateCell reducer', () => {
    it('should update the cell value and push the current board to history', () => {
      const initialState: SudokuState = {
        board: createZeroedSudokuMatrix(),
        solution: null,
        loading: false,
        error: null,
        isComplete: false,
        history: [],
        incorrectCells: createClearedIncorrectcellsMatrix(),
        selectedCell: null,
        currentDifficulty: 'Basic',
        showingIncorrect: false,
        initialBoard: createZeroedSudokuMatrix(),
        selectorPosition: { x: 0, y: 0 }
      }

      const action = updateCell({ row: 0, col: 0, value: 5 })
      const newState = sudokuReducer(initialState, action)

      expect(newState.board[0][0]).toBe(5)
      expect(newState.history.length).toBe(1)
      expect(newState.history[0][0][0]).toBe(0) // Ensure the history has the previous state
    })

    it('should update incorrectCells and isComplete when solution is available', () => {
      const initialState: SudokuState = {
        board: createZeroedSudokuMatrix(),
        solution: Array(9).fill(null).map(() => Array(9).fill(1)), // Mock solution
        loading: false,
        error: null,
        isComplete: false,
        history: [],
        incorrectCells: createClearedIncorrectcellsMatrix(),
        selectedCell: null,
        currentDifficulty: 'Basic',
        showingIncorrect: false,
        initialBoard: createZeroedSudokuMatrix(),
        selectorPosition: { x: 0, y: 0 }
      }

      for(let row=0; row<9; row++) {
        for(let col=0; col<9; col++) {
          const action = updateCell({ row, col, value: 1 })
          const newState = sudokuReducer(initialState, action)

          if ( row === 9 && col === 9 ) {
            // last update => complete 
            expect(newState.incorrectCells[row][row]).toBe(false)
            expect(newState.isComplete).toBe(true)
          } else {
            expect(newState.incorrectCells[row][row]).toBe(false)
            expect(newState.isComplete).toBe(false)
  
          }
        }
      }
    })
  })
})