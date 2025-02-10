import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Difficulty = 'Basic' | 'Hard' | 'VeryHard'

interface SudokuState {
  board: number[][]
  solution: number[][] | null
  loading: boolean
  error: string | null
  isComplete: boolean
  history: number[][][]  // Add history array to store previous board states
}

const initialState: SudokuState = {
  board: Array(9).fill(null).map(() => Array(9).fill(0)),
  solution: null,
  loading: false,
  error: null,
  isComplete: false,
  history: []  // Initialize empty history
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

const checkSolution = (board: number[][], solution: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== solution[i][j]) {
        return false
      }
    }
  }
  return true
}

export const fetchNewPuzzle = createAsyncThunk(
  'sudoku/fetchNewPuzzle',
  async (difficulty: Difficulty) => {
    const response = await fetch(`http://localhost:5000/api/Sudoku?difficulty=${difficulty}`)
    if (!response.ok) {
      throw new Error('Failed to fetch puzzle')
    }
    const data = await response.json()
    return {
      grid: parseGridString(data.grid),
      solution: parseGridString(data.solution)
    }
  }
)

const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ row: number; col: number; value: number }>) => {
      const { row, col, value } = action.payload
      
      // Save current board state to history before updating
      state.history.push(state.board.map(row => [...row]))
      
      state.board[row][col] = value
      
      if (state.solution) {
        state.isComplete = checkSolution(state.board, state.solution)
      }
    },
    undo: (state) => {
      if (state.history.length > 0) {
        // Restore the last board state
        state.board = state.history.pop()!
        // Check if the restored state is complete
        if (state.solution) {
          state.isComplete = checkSolution(state.board, state.solution)
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPuzzle.pending, (state) => {
        state.loading = true
        state.error = null
        state.isComplete = false
        state.history = []  // Clear history when starting new game
      })
      .addCase(fetchNewPuzzle.fulfilled, (state, action) => {
        state.loading = false
        state.board = action.payload.grid
        state.solution = action.payload.solution
        state.isComplete = false
        state.history = []  // Clear history when starting new game
      })
      .addCase(fetchNewPuzzle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load puzzle'
      })
  }
})

export const { updateCell, undo } = sudokuSlice.actions
export default sudokuSlice.reducer 