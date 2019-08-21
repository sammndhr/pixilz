import React, { useContext, Fragment } from 'react'
import UploadImages from './UploadImages'
import DataContext from '../context/DataContext'

export default function Main() {
  const { canvasesLoaded, imgsLoaded, imgsUploaded } = useContext(DataContext)
  let uploadImages = null
  if (!(canvasesLoaded && imgsLoaded && imgsUploaded)) {
    uploadImages = <UploadImages />
  }
  return <Fragment>{uploadImages}</Fragment>
}
