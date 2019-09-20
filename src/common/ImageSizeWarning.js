import React from 'react'

const ImageSizeWarning = () => {
  return (
    <div className='warning'>
      <svg
        className='warning-svg'
        focusable='false'
        viewBox='0 0 24 24'
        aria-hidden='true'
        role='presentation'>
        <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'></path>
      </svg>
      <span>
        Displayed size isn't the final size. Please expand browser to view exact
        size.
      </span>
    </div>
  )
}

export default ImageSizeWarning
