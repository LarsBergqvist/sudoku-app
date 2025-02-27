export interface SudokuResponse {
    puzzle: string
    solution: string
    difficulty: 'Basic' | 'Hard' | 'VeryHard'
  }