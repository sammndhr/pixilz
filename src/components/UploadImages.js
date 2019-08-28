import React, { Fragment, useState, useContext, useEffect } from 'react'
import { withRouter } from 'react-router'
import DataContext from '../context/DataContext'
import SortForm from '../common/SortForm'
import { sortFiles } from '../utils/'
import Button from '../common/Button'

const UploadImages = ({ history }) => {
  const { state, dispatch } = useContext(DataContext)
  const [dataUrls, setDataUrls] = useState([])
  const [imgsUploaded, setImgsUploaded] = useState(false)
  const [sort, setSort] = useState(true)

  useEffect(() => {
    if (!state.dataUrls.length) {
      dispatch({ type: 'SET_DATA_URLS', payload: dataUrls })
    }
    if (!state.imgsUploaded) {
      dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: imgsUploaded })
    }
  }, [dataUrls, state.dataUrls, state.imgsUploaded, imgsUploaded, dispatch])

  const readFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = evt => {
        resolve(evt.target.result)
      }
      reader.onerror = err => {
        console.error('Failed to read', file.name, 'due to', err)
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  }

  const readMultipleFiles = async files => {
    const filesArr = Array.from(files)
    const filesToProcess = sort ? sortFiles(filesArr) : filesArr
    const promises = filesToProcess.map(async file => {
      const data = await readFile(file)
      return data
    })
    return Promise.all(promises).then(results => {
      return results
    })
  }

  const uploadFiles = (e, history) => {
    readMultipleFiles(e.target.files)
      .then(results => {
        setDataUrls(results)
        setImgsUploaded(true)

        history.push('/options')
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }

  const handleCheckboxChange = sort => {
    setSort({ sort })
  }

  return (
    <Fragment>
      <SortForm handleCheckboxChange={handleCheckboxChange} />
      <Button htmlFor={'upload-images'} content={'Upload Images'} />
      <input
        id='upload-images'
        type='file'
        multiple='multiple'
        onChange={e => {
          uploadFiles(e, history)
        }}
      />
    </Fragment>
  )
}

export default withRouter(UploadImages)
