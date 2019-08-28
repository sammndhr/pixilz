import React from 'react'

const Button = ({ htmlFor, content }) => {
  return (
    <div className='button-container'>
      <label htmlFor={htmlFor}>{content}</label>
    </div>
  )
}

export default Button
