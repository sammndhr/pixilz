import React, { useEffect, useRef } from 'react'

export default function SetFocusToDivComponent() {
  const containerRef = useRef(null)

  useEffect(() => {
    containerRef.current.focus()
  })

  return (
    <div data-test={'container'} ref={containerRef} tabIndex={-1}>
      Hello There!!
    </div>
  )
}
