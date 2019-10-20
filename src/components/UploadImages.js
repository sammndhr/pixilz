import React, { useState, useContext, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router'
import DataContext from '../context/DataContext'
import SortForm from '../smallComponents/SortForm'
import { sortFiles } from '../utils/'
const UploadImages = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(DataContext)
  const { sort } = state
  const [dataUrls, setDataUrls] = useState([])
  const [imgsUploaded, setImgsUploaded] = useState(false)

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

  return (
    <SortForm
      uploadFiles={e => {
        uploadFiles(e, history)
      }}
    />
  )
}

export default withRouter(UploadImages)
