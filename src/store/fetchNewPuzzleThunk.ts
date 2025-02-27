import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '../config'
import { mockSudokuData } from '../mocks/sudokuData'
import { Difficulty } from './sudokuSlice'
import { SudokuResponse } from '../types/sudokuResponse'
// Create a function to check the environment
const getUseMockApi = () => {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
  console.log('Environment check - USE_MOCK_API:', useMockApi)
  return useMockApi
}

// Parse the sudoku data from the api into a 2D number array
// The API returns the sudoku board as a string of 81 characters, representing a 9x9 grid of numbers 1-9
// The puzzle property represents the hidden sudoku cell as a space
const parseApiSudokuString = (gridString: string): number[][] => {
  if (!gridString || typeof gridString !== 'string' || gridString.length !== 81) {
    console.error('Invalid grid string:', gridString)
    throw new Error('Invalid grid string format')
  }

  const grid: number[][] = []
  for (let i = 0; i < 9; i++) {
    const row: number[] = []
    for (let j = 0; j < 9; j++) {
      const char = gridString[i * 9 + j]
      const value = char === ' ' ? 0 : parseInt(char)
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

export const fetchNewPuzzleThunk = createAsyncThunk(
  'sudoku/fetchNewPuzzle',
  async (difficulty: Difficulty) => {
    let data: SudokuResponse
    console.log('Fetching new puzzle with difficulty:', difficulty)
    const USE_MOCK_API = getUseMockApi()

    try {
      if (USE_MOCK_API) {
        // Filter puzzles by difficulty
        const puzzles = mockSudokuData.filter(puzzle => puzzle.difficulty === difficulty)
        if (puzzles.length === 0) {
          throw new Error(`No mock puzzle found for difficulty: ${difficulty}`)
        }
        
        // Select a random puzzle
        const randomIndex = Math.floor(Math.random() * puzzles.length)
        const mockPuzzle = puzzles[randomIndex]
        
        if (!mockPuzzle.puzzle || !mockPuzzle.solution) {
          throw new Error('Mock puzzle data is incomplete')
        }
        data = mockPuzzle
      } else {
        const response = await fetch(`${API_URL}/api/Sudoku?difficulty=${difficulty}`)
        if (!response.ok) {
          throw new Error('Failed to fetch puzzle')
        }
        data = await response.json()
        if (!data.puzzle || !data.solution) {
          throw new Error('API response is incomplete')
        }
      }

      // Parse grid and create a deep copy for initialBoard immediately
      const puzzle = parseApiSudokuString(data.puzzle)
      const initialBoard = JSON.parse(JSON.stringify(puzzle))
      const solution = parseApiSudokuString(data.solution)

      // Validate all required data
      if (!Array.isArray(puzzle) || puzzle.length !== 9 || puzzle.some(row => !Array.isArray(row) || row.length !== 9)) {
        console.error('Invalid grid structure:', puzzle)
        throw new Error('Invalid grid structure after parsing')
      }

      if (!Array.isArray(solution) || solution.length !== 9 || solution.some(row => !Array.isArray(row) || row.length !== 9)) {
        console.error('Invalid solution structure:', solution)
        throw new Error('Invalid solution structure after parsing')
      }

      // Create the result object
      const result = {
        puzzle,
        solution,
        initialBoard
      }

      // Validate the complete result object
      if (!result.puzzle || !result.solution || !result.initialBoard) {
        console.error('Invalid result object:', result)
        throw new Error('Result object is incomplete')
      }

      return result
    } catch (error) {
      console.error('Error in fetchNewPuzzle:', error)
      throw error
    }
  }
) 