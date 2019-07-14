import React, { PureComponent } from 'react'
import ImageList from './ImageList.js'
import UploadImages from './UploadImages'
import Canvas from './Canvas'
import DataContext from '../context/DataContext'
import { Route } from 'react-router-dom'

export default class Main extends PureComponent {
  //Whole app was rerendering when themeContext changed with Componnet. PureComponet fixes but don't know how. Relevant: https://frontarm.com/james-k-nelson/react-context-performance/
  static contextType = DataContext

  // imageRef = React.createRef()

  renderImgList = dataContext => {
    console.log(dataContext)
    return <div>Something</div>
    // return <ImageList ref={this.imageRef} dataUrls={dataContext.dataUrls} />
  }

  renderCanvas = dataContext => {
    const imageRef = this.context.imageRef
    if (dataContext.imgsLoadStatus && !!imageRef.current) {
      return <Canvas forwardedRef={imageRef}> </Canvas>
      // Two more ways to forward refs. Look in Notion for notes (search for "forwarding refs")
    }
  }

  renderUploadButton = () => {
    return <UploadImages />
  }

  uploadButtonControl = dataContext => {
    if (!dataContext.uploadStatus) return this.renderUploadButton(dataContext)
    // return this.renderImgList(dataContext)
  }

  canvasRenderControl = dataContext => {
    //both <ImageList/> and <UploadButton/> won't render after canvas has rendered
    if (dataContext.canvasLoadStatus) return

    if (!dataContext.imgsLoadStatus)
      return this.uploadButtonControl(dataContext)

    // if (dataContext.imgsLoadStatus && dataContext.uploadStatus)
    // return this.renderImgList(dataContext)
    // but if images have uploaded AND loaded, render <ImageList/>
  }

  render() {
    const dataContext = this.context
    return (
      <main>
        {this.canvasRenderControl(dataContext)}
        {/* <ImageList/> will be rendered and <Canvas/> will use the images (and ref) after which canvasLoadStatus will change. Then this.canvasRenderControl will not return anything*/}
        {/* {this.renderCanvas(dataContext)} */}
      </main>
    )
  }
}
