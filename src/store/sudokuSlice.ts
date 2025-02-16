import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { API_URL } from '../config'
import { mockSudokuData, SudokuResponse } from '../mocks/sudokuData'

// Create a function to check the environment
const getUseMockApi = () => {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
  console.log('Environment check - USE_MOCK_API:', useMockApi)
  return useMockApi
}

export type Difficulty = 'Basic' | 'Hard' | 'VeryHard'

interface SudokuState {
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
  currentDifficulty: 'Basic',
  showingIncorrect: false,
  initialBoard: Array(9).fill(null).map(() => Array(9).fill(0))
}

const parseGridString = (gridString: string): number[][] => {
  if (!gridString || typeof gridString !== 'string' || gridString.length !== 81) {
    console.error('Invalid grid string:', gridString)
    throw new Error('Invalid grid string format')
  }

  const grid: number[][] = []
  for (let i = 0; i < 9; i++) {
    const row: number[] = []
    for (let j = 0; j < 9; j++) {
      const char = gridString[i * 9 + j]
      const value = char === ' ' || char === '.' ? 0 : parseInt(char)
      if (isNaN(value)) {
        console.error('Invalid character in grid string:', char)
        throw new Error('Invalid character in grid string')
      }
      row.push(value)
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
    let data: SudokuResponse
    console.log('Fetching new puzzle with difficulty:', difficulty)
    const USE_MOCK_API = getUseMockApi()

    try {
      if (USE_MOCK_API) {
        const mockPuzzle = mockSudokuData.find(puzzle => puzzle.difficulty === difficulty)
        if (!mockPuzzle) {
          throw new Error(`No mock puzzle found for difficulty: ${difficulty}`)
        }
        if (!mockPuzzle.grid || !mockPuzzle.solution) {
          throw new Error('Mock puzzle data is incomplete')
        }
        data = mockPuzzle
      } else {
        const response = await fetch(`${API_URL}/api/Sudoku?difficulty=${difficulty}`)
        if (!response.ok) {
          throw new Error('Failed to fetch puzzle')
        }
        data = await response.json()
        if (!data.grid || !data.solution) {
          throw new Error('API response is incomplete')
        }
      }

      // Parse grid and create a deep copy for initialBoard immediately
      const grid = parseGridString(data.grid)
      const initialBoard = JSON.parse(JSON.stringify(grid)) // Ensure deep copy
      const solution = parseGridString(data.solution)

      // Validate all required data
      if (!Array.isArray(grid) || grid.length !== 9 || grid.some(row => !Array.isArray(row) || row.length !== 9)) {
        console.error('Invalid grid structure:', grid)
        throw new Error('Invalid grid structure after parsing')
      }

      if (!Array.isArray(solution) || solution.length !== 9 || solution.some(row => !Array.isArray(row) || row.length !== 9)) {
        console.error('Invalid solution structure:', solution)
        throw new Error('Invalid solution structure after parsing')
      }

      if (!Array.isArray(initialBoard) || initialBoard.length !== 9 || initialBoard.some(row => !Array.isArray(row) || row.length !== 9)) {
        console.error('Invalid initialBoard structure:', initialBoard)
        throw new Error('Invalid initialBoard structure after creation')
      }

      // Create the result object
      const result = {
        grid,
        solution,
        initialBoard
      }

      // Validate the complete result object
      if (!result.grid || !result.solution || !result.initialBoard) {
        console.error('Invalid result object:', result)
        throw new Error('Result object is incomplete')
      }

      // Debug logging
      console.log('Puzzle data:', {
        gridLength: grid.length,
        solutionLength: solution.length,
        initialBoardLength: initialBoard.length,
        difficulty
      })

      return result
    } catch (error) {
      console.error('Error in fetchNewPuzzle:', error)
      throw error
    }
  }
)

// Move validation to be called when needed
const validateMockData = () => {
  const USE_MOCK_API = getUseMockApi()
  if (USE_MOCK_API) {
    mockSudokuData.forEach((puzzle, index) => {
      if (!puzzle.grid || !puzzle.solution || !puzzle.difficulty) {
        console.error(`Invalid mock puzzle data at index ${index}:`, puzzle)
        throw new Error('Invalid mock puzzle data')
      }
      if (puzzle.grid.length !== 81 || puzzle.solution.length !== 81) {
        console.error(`Invalid puzzle length at index ${index}:`, puzzle)
        throw new Error('Mock puzzle grid or solution has incorrect length')
      }
    })
  }
}

// Call validation after store initialization
validateMockData()

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewPuzzle.pending, (state, _) => {
        state.loading = true
        state.error = null
        state.isComplete = false
        state.history = []
        state.incorrectCells = Array(9).fill(null).map(() => Array(9).fill(false))
        state.selectedCell = null
        state.initialBoard = Array(9).fill(null).map(() => Array(9).fill(0))
        localStorage.removeItem('sudokuGameState')
      })
      .addCase(fetchNewPuzzle.fulfilled, (state, action) => {
        state.loading = false
        state.board = action.payload.grid
        state.solution = action.payload.solution
        state.initialBoard = action.payload.initialBoard
        state.isComplete = false
        state.history = []
        state.incorrectCells = Array(9).fill(null).map(() => Array(9).fill(false))
        state.selectedCell = null
        state.currentDifficulty = action.meta.arg
        
        // Save initial state
        saveGameState(state, state.initialBoard)
      })
      .addCase(fetchNewPuzzle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load puzzle'
      })
  }
})

export const { updateCell, undo, selectCell, loadSavedGameState, setShowingIncorrect } = sudokuSlice.actions
export default sudokuSlice.reducer 