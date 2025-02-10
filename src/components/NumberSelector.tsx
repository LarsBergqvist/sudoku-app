import { useEffect, useRef } from 'react'
import './NumberSelector.css'

interface NumberSelectorProps {
  onSelect: (value: number) => void
  onClose: () => void
  position: { x: number; y: number }
}

const NumberSelector = ({ onSelect, onClose, position }: NumberSelectorProps) => {
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.number-selector')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    const selector = selectorRef.current
    if (!selector) return

    const rect = selector.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let { x, y } = position
    const padding = 10 // Minimum distance from screen edge

    // Adjust horizontal position
    if (x + rect.width/2 > viewportWidth - padding) {
      x = viewportWidth - rect.width - padding
    }
    if (x - rect.width/2 < padding) {
      x = rect.width/2 + padding
    }

    // Adjust vertical position
    const showAbove = y > viewportHeight/2
    if (showAbove) {
      // Show above the cell if in bottom half of screen
      selector.style.transform = 'translate(-50%, -100%)'
      selector.style.marginTop = '-10px'
      if (y - rect.height < padding) {
        y = rect.height + padding
      }
    } else {
      // Show below the cell if in top half of screen
      selector.style.transform = 'translate(-50%, 0)'
      selector.style.marginTop = '10px'
      if (y + rect.height > viewportHeight - padding) {
        y = viewportHeight - rect.height - padding
      }
    }

    selector.style.left = `${x}px`
    selector.style.top = `${y}px`
  }, [position])

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div 
      ref={selectorRef}
      className="number-selector"
    >
      <div className="number-grid">
        {numbers.map(num => (
          <button
            key={num}
            className="number-button"
            onClick={() => onSelect(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="number-button clear"
          onClick={() => onSelect(0)}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default NumberSelector 