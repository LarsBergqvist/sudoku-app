import { Dispatch } from 'redux'
import { selectCell, updateCell } from '../store/sudokuSlice'

export const handleCellClick = (
  row: number, 
  col: number, 
  event: React.MouseEvent<HTMLDivElement>, 
  initialBoard: number[][] | undefined, 
  selectedCell: { row: number, col: number } | null, 
  dispatch: Dispatch, 
  setSelectorPosition: (position: { x: number, y: number }) => void
) => {
  if (initialBoard && initialBoard[row]?.[col] !== 0) {
    dispatch(selectCell(null))
    return
  }

  const cellElement = event.currentTarget
  const rect = cellElement.getBoundingClientRect()
  setSelectorPosition({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  })

  if (selectedCell?.row === row && selectedCell?.col === col) {
    dispatch(selectCell(null))
  } else {
    dispatch(selectCell({ row, col }))
  }
}

export const handleBoardClick = (
  e: React.MouseEvent, 
  dispatch: Dispatch
) => {
  if ((e.target as HTMLElement).classList.contains('board-background')) {
    dispatch(selectCell(null))
  }
}

export const handleNumberSelect = (
  value: number, 
  selectedCell: { row: number, col: number } | null, 
  dispatch: Dispatch
) => {
  if (selectedCell) {
    dispatch(updateCell({ 
      row: selectedCell.row, 
      col: selectedCell.col, 
      value 
    }))
  }
  dispatch(selectCell(null))
}

export const handleKeyDown = (
  e: KeyboardEvent, 
  selectedCell: { row: number, col: number } | null, 
  dispatch: Dispatch
) => {
  if (!selectedCell) return

  const { row, col } = selectedCell

  switch (e.key) {
    case 'ArrowUp':
      if (row > 0) dispatch(selectCell({ row: row - 1, col }))
      break
    case 'ArrowDown':
      if (row < 8) dispatch(selectCell({ row: row + 1, col }))
      break
    case 'ArrowLeft':
      if (col > 0) dispatch(selectCell({ row, col: col - 1 }))
      break
    case 'ArrowRight':
      if (col < 8) dispatch(selectCell({ row, col: col + 1 }))
      break
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      handleNumberSelect(parseInt(e.key), selectedCell, dispatch)
      break
    case 'Backspace':
    case 'Delete':
      handleNumberSelect(0, selectedCell, dispatch)
      break
    case 'Escape':
      dispatch(selectCell(null))
      break
  }
} 