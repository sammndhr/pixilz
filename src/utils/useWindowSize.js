import { useState, useEffect } from 'react'

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  })

  useEffect(() => {
    const isClient = typeof window === 'object'
    function getSize() {
      return {
        width: isClient ? document.body.clientWidth : undefined,
        height: isClient ? document.body.clientHeight : undefined
      }
    }
    if (!isClient) {
      return false
    }

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}
