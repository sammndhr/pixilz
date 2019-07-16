import React, { PureComponent } from 'react'
// import ImageList from './ImageList.js'
import UploadImages from './UploadImages'
import Canvas from './Canvas'
import DataContext from '../context/DataContext'
import { Route } from 'react-router-dom'

export default class Main extends PureComponent {
  //Whole app was rerendering when themeContext changed with Componnet. PureComponet fixes but don't know how. Relevant: https://frontarm.com/james-k-nelson/react-context-performance/
  static contextType = DataContext

  render() {
    const { canvasLoadStatus, imgsLoadStatus, uploadStatus } = this.context

    let uploadImages = null
    if (!(canvasLoadStatus && imgsLoadStatus && uploadStatus)) {
      uploadImages = <UploadImages />
    }
    return <main>{uploadImages}</main>
  }
}
