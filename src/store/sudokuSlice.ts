import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchNewPuzzleThunk } from './fetchNewPuzzleThunk'
import { createZeroedSudokuMatrix, createClearedIncorrectcellsMatrix } from '../utils/sudokuFunctions'
export type Difficulty = 'Basic' | 'Hard' | 'VeryHard'

export interface SudokuState {
  board: number[][]
  solution: number[][] | null
  loading: boolean
  error: string | null
  isComplete: boolean
  history: number[][][]
  incorrectCells: boolean[][] 
  selectedCell: { row: number; col: number } | null
  currentDifficulty: Difficulty
  showingIncorrect: boolean
  initialBoard: number[][]
  selectorPosition: { x: number, y: number }
}

interface SavedGameState {
  board: number[][]
  solution: number[][] | null
  initialBoard: number[][]
  history: number[][][]
  difficulty: Difficulty
}

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

const checkSolution = (board: number[][]): boolean => {
  return !board.some(row => row.includes(0))
}

const validateBoard = (board: number[][], solution: number[][]): boolean[][] => {
  return board.map((row, i) => 
    row.map((cell, j) => 
      cell !== 0 && cell !== solution[i][j]
    )
  )
}

const saveGameState = (state: SudokuState, initialBoard: number[][]) => {
  const savedState: SavedGameState = {
    board: state.board,
    solution: state.solution,
    initialBoard: initialBoard,
    history: state.history,
    difficulty: state.currentDifficulty
  }
  localStorage.setItem('sudokuGameState', JSON.stringify(savedState))
}

export const loadSavedGame = (): SavedGameState | null => {
  const saved = localStorage.getItem('sudokuGameState')
  return saved ? JSON.parse(saved) : null
}

const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ row: number; col: number; value: number }>) => {
      const { row, col, value } = action.payload
      
      state.history.push(state.board.map(row => [...row]))
      state.board[row][col] = value
      
      if (state.solution) {
        state.incorrectCells = validateBoard(state.board, state.solution)
        const isFilled = checkSolution(state.board)
        state.isComplete = isFilled && !state.incorrectCells.some(row => row.some(cell => cell))
      }
      
      // Try to get initial board from localStorage first
      const savedGame = loadSavedGame()
      if (savedGame) {
        saveGameState(state, savedGame.initialBoard)
      } else {
        // If no saved game exists, use the current board as initial board
        // This happens when the game is first launched
        saveGameState(state, state.board.map(row => [...row]))
      }
    },
    undo: (state) => {
      if (state.history.length > 0) {
        state.board = state.history.pop()!
        if (state.solution) {
          state.incorrectCells = validateBoard(state.board, state.solution)
          const isFilled = checkSolution(state.board)
          state.isComplete = isFilled && !state.incorrectCells.some(row => row.some(cell => cell))
        }
      }
    },
    selectCell: (state, action: PayloadAction<{ row: number; col: number } | null>) => {
      state.selectedCell = action.payload
    },
    loadSavedGameState: (state, action: PayloadAction<SavedGameState>) => {
      state.board = action.payload.board
      state.solution = action.payload.solution
      state.history = action.payload.history
      state.currentDifficulty = action.payload.difficulty
      state.initialBoard = action.payload.initialBoard
      if (state.solution) {
        state.incorrectCells = validateBoard(state.board, state.solution)
        state.isComplete = checkSolution(state.board) && 
          !state.incorrectCells.some(row => row.some(cell => cell))
      }
    },
    setShowingIncorrect: (state, action: PayloadAction<boolean>) => {
      state.showingIncorrect = action.payload
    },
    setSelectorPosition(state, action: PayloadAction<{ x: number, y: number }>) {
      state.selectorPosition = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPuzzleThunk.pending, (state) => {
        state.loading = true
        state.error = null
        state.isComplete = false
        state.history = []
        state.incorrectCells = createClearedIncorrectcellsMatrix()
        state.selectedCell = null
        state.initialBoard = createZeroedSudokuMatrix()
        localStorage.removeItem('sudokuGameState')
      })
      .addCase(fetchNewPuzzleThunk.fulfilled, (state, action) => {
        state.loading = false
        state.board = action.payload.puzzle
        state.solution = action.payload.solution
        state.initialBoard = action.payload.initialBoard
        state.isComplete = false
        state.history = []
        state.incorrectCells = createClearedIncorrectcellsMatrix()
        state.selectedCell = null
        state.currentDifficulty = action.meta.arg
        
        // Save initial state
        saveGameState(state, state.initialBoard)
      })
      .addCase(fetchNewPuzzleThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load puzzle'
      })
  }
})

export const { updateCell, undo, selectCell, loadSavedGameState, setShowingIncorrect, setSelectorPosition } = sudokuSlice.actions
export default sudokuSlice.reducer
