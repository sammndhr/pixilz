import React from 'react'
const Form = () => {
  return (
    <div className='options'>
      <fieldset>
        <legend>Options</legend>
        <label className='form-check-label' htmlFor='sorted'>
          <input
            className='input'
            type='checkbox'
            name='sorted'
            id='sorted'
            defaultChecked
          />
          <span>Auto sort after uploading</span>
        </label>
      </fieldset>
    </div>
  )
}
export default Form
