import { describe, it, expect } from 'vitest'
import sudokuReducer, { updateCell, SudokuState } from './sudokuSlice'

describe('sudokuSlice', () => {
  describe('updateCell reducer', () => {
    it('should update the cell value and push the current board to history', () => {
      const initialState: SudokuState = {
        board: Array(9).fill(null).map(() => Array(9).fill(0)),
        solution: null,
        loading: false,
        error: null,
        isComplete: false,
        history: [],
        incorrectCells: Array(9).fill(null).map(() => Array(9).fill(false)),
        selectedCell: null,
        currentDifficulty: 'Basic',
        showingIncorrect: false,
        initialBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
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
        board: Array(9).fill(null).map(() => Array(9).fill(0)),
        solution: Array(9).fill(null).map(() => Array(9).fill(1)), // Mock solution
        loading: false,
        error: null,
        isComplete: false,
        history: [],
        incorrectCells: Array(9).fill(null).map(() => Array(9).fill(false)),
        selectedCell: null,
        currentDifficulty: 'Basic',
        showingIncorrect: false,
        initialBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
        selectorPosition: { x: 0, y: 0 }
      }

      const action = updateCell({ row: 0, col: 0, value: 1 })
      const newState = sudokuReducer(initialState, action)

      expect(newState.incorrectCells[0][0]).toBe(false)
      expect(newState.isComplete).toBe(false) // Since not all cells are filled correctly
    })
  })
})