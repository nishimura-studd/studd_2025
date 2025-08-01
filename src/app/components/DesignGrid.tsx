'use client'

import { useState, useEffect } from 'react'

export default function DesignGrid() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'g') {
        event.preventDefault()
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  return (
    <div className={`design-grid ${isVisible ? 'visible' : ''}`}>
      {isVisible && (
        <div 
          className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded pointer-events-auto cursor-pointer"
          onClick={() => setIsVisible(false)}
        >
          Grid (Ctrl+G)
        </div>
      )}
    </div>
  )
}