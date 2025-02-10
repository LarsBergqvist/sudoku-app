import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SudokuState {
  board: number[][]
  loading: boolean
  error: string | null
}

const initialState: SudokuState = {
  board: Array(9).fill(null).map(() => Array(9).fill(0)),
  loading: false,
  error: null
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

export const fetchNewPuzzle = createAsyncThunk(
  'sudoku/fetchNewPuzzle',
  async () => {
    const response = await fetch('http://localhost:5000/api/Sudoku?dificulty=basic')
    if (!response.ok) {
      throw new Error('Failed to fetch puzzle')
    }
    const data = await response.json()
    return parseGridString(data.grid)
  }
)

const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ row: number; col: number; value: number }>) => {
      const { row, col, value } = action.payload
      state.board[row][col] = value
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPuzzle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewPuzzle.fulfilled, (state, action) => {
        state.loading = false
        state.board = action.payload
      })
      .addCase(fetchNewPuzzle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load puzzle'
      })
  }
})

export const { updateCell } = sudokuSlice.actions
export default sudokuSlice.reducer 