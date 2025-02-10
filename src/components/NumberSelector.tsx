import { useEffect } from 'react'
import './NumberSelector.css'

interface NumberSelectorProps {
  onSelect: (value: number) => void
  onClose: () => void
  position: { x: number; y: number }
}

const NumberSelector = ({ onSelect, onClose, position }: NumberSelectorProps) => {
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

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div 
      className="number-selector"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
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