import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setShowingIncorrect, undo } from '../store/sudokuSlice'
import { fetchNewPuzzleThunk } from '../store/fetchNewPuzzleThunk'
import './GameControls.css'
import { Difficulty } from '../types/difficulty'

const GameControls = () => {
  const dispatch = useAppDispatch()
  const history = useAppSelector((state) => state.sudoku.history)

  const handleNewGame = (difficulty: Difficulty) => {
    dispatch(fetchNewPuzzleThunk(difficulty))
  }

  return (
    <div className="game-controls">
      <div className="button-row">
        <button 
          className="show-incorrect-button"
          onMouseDown={() => dispatch(setShowingIncorrect(true))}
          onMouseUp={() => dispatch(setShowingIncorrect(false))}
          onMouseLeave={() => dispatch(setShowingIncorrect(false))}
          onTouchStart={() => dispatch(setShowingIncorrect(true))}
          onTouchEnd={() => dispatch(setShowingIncorrect(false))}
        >
          Show incorrect
        </button>
        <button 
          className="undo-button" 
          onClick={() => dispatch(undo())}
          disabled={history.length === 0}
        >
          ↩ Undo
        </button>
      </div>
      <div className="difficulty-buttons">
        <button 
          className="new-game-button basic" 
          onClick={() => handleNewGame('Basic')}
        >
          New Basic Game
        </button>
        <button 
          className="new-game-button hard" 
          onClick={() => handleNewGame('Hard')}
        >
          New Hard Game
        </button>
        <button 
          className="new-game-button very-hard" 
          onClick={() => handleNewGame('VeryHard')}
        >
          New Very Hard Game
        </button>
      </div>
    </div>
  )
}

export default GameControls 