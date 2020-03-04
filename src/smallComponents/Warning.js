import React from 'react'

const Warning = ({ text }) => {
  return (
    <div className='warning'>
      <div className='svg-wrapper'>
        <svg
          className='warning-svg'
          version='1.1'
          id='Layer_1'
          xmlns='http://www.w3.org/2000/svg'
          x='0px'
          y='0px'
          viewBox='0 0 180 180'
        >
          <path
            d='M89,9C44.3,9.6,8.5,46.3,9,91c0.6,44.7,37.3,80.5,82,80c44.7-0.6,80.5-37.3,80-82c-0.5-44-36-79.5-80-80H89z
	 M90,47v58 M90,130v1'
          />
        </svg>
      </div>
      <span className='warning-text'>{text}</span>
    </div>
  )
}

export default Warning
