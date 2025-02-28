import type { Difficulty } from './difficulty'

export interface SudokuResponse {
    puzzle: string
    solution: string
    difficulty: Difficulty
  }