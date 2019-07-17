import React, { useContext, Fragment } from 'react'
import UploadImages from './UploadImages'
import DataContext from '../context/DataContext'

export default function Main() {
  const { canvasLoadStatus, imgsLoadStatus, uploadStatus } = useContext(
    DataContext
  )
  let uploadImages = null
  if (!(canvasLoadStatus && imgsLoadStatus && uploadStatus)) {
    uploadImages = <UploadImages />
  }
  return <Fragment>{uploadImages}</Fragment>
}
