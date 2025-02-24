import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchNewPuzzle, loadSavedGame, loadSavedGameState } from '../store/sudokuSlice'
import SudokuBoard from './SudokuBoard'
import GameControls from './GameControls'
import './SudokuGame.css'
import useSudokuInteractions from '../hooks/useSudokuInteractions'

const SudokuGame = () => {
  const dispatch = useAppDispatch()
  const { 
    loading, 
    error, 
    isComplete, 
  } = useAppSelector((state) => state.sudoku)

  const {
    handleKeyDown
  } = useSudokuInteractions()

  useEffect(() => {
    const savedGame = loadSavedGame()
    if (savedGame) {
      dispatch(loadSavedGameState(savedGame))
    } else {
      dispatch(fetchNewPuzzle('Basic'))
    }
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (loading) {
    return <div>Loading puzzle...</div>
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchNewPuzzle('Basic'))}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="game-container">
      {isComplete && (
        <div className="victory-message">
          🎉 Congratulations! You've solved the puzzle! 🎉
        </div>
      )}
      <SudokuBoard />
      <GameControls />
    </div>
  )
}

export default SudokuGame 