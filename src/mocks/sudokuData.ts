export interface SudokuResponse {
  grid: string
  solution: string
  difficulty: 'Basic' | 'Hard' | 'VeryHard'
}

// Sample puzzles for each difficulty level
export const mockSudokuData: SudokuResponse[] = [
  {
    grid: "   3 7548685 2 97    85962 1  6  2 55 8974  63 9 1   7   7 21   5 196834 91538 6 ",
    solution: "912367548685421973743859621174683295528974316369215487836742159257196834491538762",
    difficulty: "Basic"
  },
  {
    grid: " 4791    68 4 5  7  5      5 91   38  3 89 7    7  56       7 585 2 1  3  4  312 ",
    solution: "347918652681425397925367814579146238263589471418732569132694785856271943794853126",
    difficulty: "Hard"
  },
  {
    grid: "   1  32   3 4  5 8123  9  4  7  8  3 6  957  8   3  42    6 8 1 8  7   63      5",
    solution: "564198327973642158812375946495761832326489571781253694257916483148537269639824715",
    difficulty: "VeryHard"
  }
] 