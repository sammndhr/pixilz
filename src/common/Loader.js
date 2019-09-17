import React, { Fragment } from 'react'

const Loader = () => {
  return (
    <Fragment>
      <div
        className='loader-wrapper'
        style={{
          zIndex: 1000,
          height: document.body.clientHeight,
          width: document.body.clientWidth
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
