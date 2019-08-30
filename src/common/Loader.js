import React, { Fragment } from 'react'

const Loader = () => {
  return (
    <Fragment>
      <div
        className='loader'
        style={{ zIndex: 1000, position: 'absolute', top: '100px' }}></div>
    </Fragment>
  )
}

export default Loader
