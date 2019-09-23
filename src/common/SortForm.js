import React, { Fragment, useContext } from 'react'
import Button from './Button'
import DataContext from '../context/DataContext'

const SortForm = ({ uploadFiles }) => {
  const { state, dispatch } = useContext(DataContext)
  const { sort } = state

  const handleChange = e => {
    dispatch({ type: 'UPDATE_SORT', payload: e.target.checked })
  }

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
