import React, { Fragment, useContext } from 'react'
import { UploadButton } from './Button'
import DataContext from '../context/DataContext'

const SortForm = ({ uploadFiles }) => {
  const { state, dispatch } = useContext(DataContext)
  const { sort, uploadFolder } = state

  const handleSortChange = e => {
    dispatch({ type: 'UPDATE_SORT', payload: e.target.checked })
  }

  const handleUploadChange = e => {
    dispatch({ type: 'UPDATE_UPLOAD_FOLDER', uploadFolder: e.target.checked })
  }

  return (
    <Fragment>
      <div className='form options'>
        <fieldset className='form-group'>
          <label className='form-check-label' htmlFor='sort'>
            <input type='checkbox' name='sort' id='sort' checked={sort} onChange={handleSortChange} />
            <span className='cb-span'></span>
            <span>Auto sort after uploading</span>
          </label>
          <label className='form-check-label' htmlFor='upload-folder'>
            <input type='checkbox' name='upload-folder' id='upload-folder' checked={uploadFolder} onChange={handleUploadChange} />
            <span className='cb-span'></span>
            <span>Select folder instead of multiple files</span>
          </label>

          <UploadButton htmlFor={'upload-images'} content={'Upload Images'} />
          {uploadFolder ? (
            <input
              id='upload-images'
              type='file'
              multiple={false}
              webkitdirectory='true'
              onChange={e => {
                uploadFiles(e)
              }}
            />
          ) : (
            <input
              id='upload-images'
              type='file'
              accept='image/*'
              multiple={true}
              onChange={e => {
                uploadFiles(e)
              }}
            />
          )}
        </fieldset>
      </div>
    </Fragment>
  )
}
export default SortForm
