import React, { Fragment, useEffect, useContext } from 'react'
import Button from './Button'
import DataContext from '../context/DataContext'

const SortForm = ({ handleCheckboxChange }) => {
  const data = useContext(DataContext)
  const { sort } = data
  const handleChange = e => {
    data.setContextState({ sort: e.target.checked })
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
