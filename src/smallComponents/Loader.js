import React, { Fragment } from 'react'
import { useWindowSize } from '../utils/'

const Loader = () => {
  const size = useWindowSize()
  return (
    <Fragment>
      <div
        className='loader-wrapper'
        style={{
          zIndex: 1000,
          height: size.innerHeight || window.innerHeight,
          width: size.width
        }}
      >
        <div className='loader' />
      </div>
    </Fragment>
  )
}

export default Loader
