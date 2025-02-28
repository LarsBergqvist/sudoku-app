import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NumberSelector from './NumberSelector'

describe('NumberSelector Component', () => {
  const mockOnSelect = vi.fn()
  const mockOnClose = vi.fn()
  const position = { x: 100, y: 100 }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders number buttons and clear button', () => {
    const { getByText } = render(
      <NumberSelector onSelect={mockOnSelect} onClose={mockOnClose} position={position} />
    )

    for (let i = 1; i <= 9; i++) {
      expect(getByText(i.toString())).toBeInTheDocument()
    }
    expect(getByText('Clear')).toBeInTheDocument()
  })

  it('calls onSelect with correct number when a number button is clicked', () => {
    const { getByText } = render(
      <NumberSelector onSelect={mockOnSelect} onClose={mockOnClose} position={position} />
    )

    fireEvent.click(getByText('3'))
    expect(mockOnSelect).toHaveBeenCalledWith(3)
  })

  it('calls onSelect with 0 when the clear button is clicked', () => {
    const { getByText } = render(
      <NumberSelector onSelect={mockOnSelect} onClose={mockOnClose} position={position} />
    )

    fireEvent.click(getByText('Clear'))
    expect(mockOnSelect).toHaveBeenCalledWith(0)
  })

  it('calls onClose when clicking outside the component', () => {
    const { container } = render(
      <div>
        <NumberSelector onSelect={mockOnSelect} onClose={mockOnClose} position={position} />
        <div data-testid="outside-element">Outside</div>
      </div>
    )

    fireEvent.mouseDown(container.querySelector('[data-testid="outside-element"]')!)
    expect(mockOnClose).toHaveBeenCalled()
  })
}) 