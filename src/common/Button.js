import React from 'react'

const Button = ({ htmlFor, content }) => {
  return (
    <div className='button-container upload-btn'>
      <label htmlFor={htmlFor}>
        <div className='cloud-cover'></div>
        <span>{content}</span>
      </label>
    </div>
  )
}

export default Button
// height: '30px',width: '50px',position: 'absolute',backgroundColor: 'red',left: 0,
