import React, { Fragment } from 'react'

const Loader = () => {
  return (
    <Fragment>
      <div
        className='loader-wrapper'
        style={{
          zIndex: 1000,
          height: window.innerHeight,
          width: window.innerWidth
        }}>
        <div
          className='loader'
          // style={{ position: 'absolute', top: '100px' }}
        />
      </div>
    </Fragment>
  )
}

export default Loader
