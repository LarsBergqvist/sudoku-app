export const createZeroedSudokuMatrix = ():number[][]  => {
    return Array(9).fill(null).map(() => Array(9).fill(0))
}

export const createClearedIncorrectcellsMatrix = ():boolean[][]  => {
    return Array(9).fill(null).map(() => Array(9).fill(false))
}