import React, { Fragment, useContext } from 'react'
import { UploadButton } from './Button'
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
          <input
            type='checkbox'
            name='sort'
            id='sort'
            checked={sort}
            onChange={handleChange}
          />
          <label className='form-check-label' htmlFor='sort'>
            <span id='cb-span'></span>
            <span>Auto sort after uploading</span>
          </label>

          <UploadButton htmlFor={'upload-images'} content={'Upload Images'} />
          <input
            id='upload-images'
            type='file'
            accept='image/*'
            multiple='multiple'
            onChange={e => {
              uploadFiles(e)
            }}
          />
        </fieldset>
      </div>
    </Fragment>
  )
}
export default SortForm
