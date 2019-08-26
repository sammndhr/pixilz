import React, { Fragment, useState, useEffect } from 'react'
import Button from './Button'

const SortForm = ({ handleCheckboxChange }) => {
  const [sort, setSort] = useState(true)

  const handleChange = e => {
    setSort(e.target.checked)
  }

  useEffect(() => {
    handleCheckboxChange(sort)
  }, [handleCheckboxChange, sort])

  return (
    <Fragment>
      <div className='options'>
        <fieldset>
          <legend>Options</legend>
          <label className='form-check-label' htmlFor='sorted'>
            <input
              className='input'
              type='checkbox'
              name='sorted'
              id='sorted'
              checked={sort}
              onChange={handleChange}
            />
            <span>Auto sort after uploading</span>
          </label>
        </fieldset>
      </div>
      <Button />
    </Fragment>
  )
}
export default SortForm
