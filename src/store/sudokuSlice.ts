import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { API_URL } from '../config'

export type Difficulty = 'Basic' | 'Hard' | 'VeryHard'

interface SudokuState {
  board: number[][]
  solution: number[][] | null
  loading: boolean
  error: string | null
  isComplete: boolean
  history: number[][][]
  incorrectCells: boolean[][]  // Add this to track incorrect cells
  selectedCell: { row: number; col: number } | null  // Add this to track selected cell
  currentDifficulty: Difficulty
}

interface SavedGameState {
  board: number[][]
  solution: number[][] | null
  initialBoard: number[][]
  history: number[][][]
  difficulty: Difficulty
}

const initialState: SudokuState = {
  board: Array(9).fill(null).map(() => Array(9).fill(0)),
  solution: null,
  loading: false,
  error: null,
  isComplete: false,
  history: [],
  incorrectCells: Array(9).fill(null).map(() => Array(9).fill(false)),
  selectedCell: null,
  currentDifficulty: 'Basic'
}

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

export const fetchNewPuzzle = createAsyncThunk(
  'sudoku/fetchNewPuzzle',
  async (difficulty: Difficulty) => {
    const response = await fetch(`${API_URL}/api/Sudoku?difficulty=${difficulty}`)
    if (!response.ok) {
      throw new Error('Failed to fetch puzzle')
    }
    const data = await response.json()
    const grid = parseGridString(data.grid)
    return {
      grid,
      solution: parseGridString(data.solution),
      initialBoard: grid.map(row => [...row])
    }
  }
)

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
      
      // Get the initial board from localStorage to ensure we keep the original puzzle state
      const savedGame = loadSavedGame()
      if (savedGame) {
        saveGameState(state, savedGame.initialBoard)
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
      state.incorrectCells = validateBoard(state.board, state.solution || [])
      state.isComplete = checkSolution(state.board) && 
        !state.incorrectCells.some(row => row.some(cell => cell))
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPuzzle.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.isComplete = false
        state.history = []
        state.incorrectCells = Array(9).fill(null).map(() => Array(9).fill(false))
        state.selectedCell = null
        localStorage.removeItem('sudokuGameState')
      })
      .addCase(fetchNewPuzzle.fulfilled, (state, action) => {
        state.loading = false
        state.board = action.payload.grid
        state.solution = action.payload.solution
        state.isComplete = false
        state.history = []
        state.incorrectCells = Array(9).fill(null).map(() => Array(9).fill(false))
        state.selectedCell = null
        state.currentDifficulty = action.meta.arg  // Save the difficulty
        
        // Save initial state with the initial grid
        saveGameState(state, action.payload.grid)  // Save the original puzzle state
      })
      .addCase(fetchNewPuzzle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load puzzle'
      })
  }
})

export const { updateCell, undo, selectCell, loadSavedGameState } = sudokuSlice.actions
export default sudokuSlice.reducer 