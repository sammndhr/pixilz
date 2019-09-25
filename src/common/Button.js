import React from 'react'

const UploadButton = ({ htmlFor, content }) => {
  return (
    <div className='button-container upload-btn'>
      <label className='button' htmlFor={htmlFor}>
        <div className='cloud-cover'></div>
        <span>{content}</span>
      </label>
    </div>
  )
}

const Button = ({ handleClick, content, className }) => {
  return (
    <div className={className || 'button-container'}>
      <button onClick={handleClick}>{content}</button>
    </div>
  )
}

export { UploadButton, Button }
