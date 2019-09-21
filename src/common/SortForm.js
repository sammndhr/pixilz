import React, { Fragment, useState, useEffect } from 'react'
import Button from './Button'
const SortForm = ({ handleCheckboxChange, uploadFiles }) => {
  const [sort, setSort] = useState(true)

  const handleChange = e => {
    setSort(e.target.checked)
  }

  useEffect(() => {
    handleCheckboxChange(sort)
  }, [handleCheckboxChange, sort])

  return (
    <Fragment>
      <div className='form options'>
        <fieldset className='form-group'>
          {/* <legend>Options</legend> */}
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
        <Button htmlFor={'upload-images'} content={'Upload Images'} />
        <input
          id='upload-images'
          type='file'
          accept='image/*'
          multiple='multiple'
          onChange={e => {
            uploadFiles(e)
          }}
        />
      </div>
    </Fragment>
  )
}
export default SortForm
