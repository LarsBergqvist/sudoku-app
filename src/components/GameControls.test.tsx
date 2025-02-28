import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import GameControls from './GameControls'
import { setShowingIncorrect, undo } from '../store/sudokuSlice'
import { vi } from 'vitest'

// Create a mock store
const mockStore = configureStore([])

// Mock the fetchNewPuzzleThunk
vi.mock('../store/fetchNewPuzzleThunk', () => ({
  fetchNewPuzzleThunk: vi.fn((difficulty) => ({ type: 'FETCH_NEW_PUZZLE', difficulty }))
}))

describe('GameControls Component', () => {
  let store: any

  beforeEach(() => {
    store = mockStore({
      sudoku: {
        history: []
      }
    })
    store.dispatch = vi.fn()
  })

  test('renders Show Incorrect button', () => {
    render(
      <Provider store={store}>
        <GameControls />
      </Provider>
    )
    expect(screen.getByText('Show incorrect')).toBeInTheDocument()
  })

  test('dispatches setShowingIncorrect on Show Incorrect button interactions', () => {
    render(
      <Provider store={store}>
        <GameControls />
      </Provider>
    )
    const button = screen.getByText('Show incorrect')

    fireEvent.mouseDown(button)
    expect(store.dispatch).toHaveBeenCalledWith(setShowingIncorrect(true))

    fireEvent.mouseUp(button)
    expect(store.dispatch).toHaveBeenCalledWith(setShowingIncorrect(false))

    fireEvent.mouseLeave(button)
    expect(store.dispatch).toHaveBeenCalledWith(setShowingIncorrect(false))

    fireEvent.touchStart(button)
    expect(store.dispatch).toHaveBeenCalledWith(setShowingIncorrect(true))

    fireEvent.touchEnd(button)
    expect(store.dispatch).toHaveBeenCalledWith(setShowingIncorrect(false))
  })

  test('renders Undo button and it is disabled when history is empty', () => {
    render(
      <Provider store={store}>
        <GameControls />
      </Provider>
    )
    const button = screen.getByText('↩ Undo')
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  test('dispatches undo action on Undo button click', () => {
    store = mockStore({
      sudoku: {
        history: [{}] // Non-empty history
      }
    })
    store.dispatch = vi.fn()

    render(
      <Provider store={store}>
        <GameControls />
      </Provider>
    )
    const button = screen.getByText('↩ Undo')
    fireEvent.click(button)
    expect(store.dispatch).toHaveBeenCalledWith(undo())
  })

  test('dispatches fetchNewPuzzleThunk with correct difficulty on New Game buttons', () => {
    render(
      <Provider store={store}>
        <GameControls />
      </Provider>
    )

    const basicButton = screen.getByText('New Basic Game')
    fireEvent.click(basicButton)
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'FETCH_NEW_PUZZLE', difficulty: 'Basic' })

    const hardButton = screen.getByText('New Hard Game')
    fireEvent.click(hardButton)
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'FETCH_NEW_PUZZLE', difficulty: 'Hard' })

    const veryHardButton = screen.getByText('New Very Hard Game')
    fireEvent.click(veryHardButton)
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'FETCH_NEW_PUZZLE', difficulty: 'VeryHard' })
  })
}) 