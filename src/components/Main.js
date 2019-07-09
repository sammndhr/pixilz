import React, { Component } from 'react'
import ImageList from './ImageList.js'
import UploadImages from './UploadImages'
import Canvas from './Canvas'
import DataContext from '../context/DataContext'

export default class Main extends Component {
  static contextType = DataContext

  imageRef = React.createRef()

  state = {
    dataUrls: [],
    uploadStatus: false,
    imgsLoadStatus: false,
    canvasLoadStatus: false,
    setData: ({ dataUrls, uploadStatus }) => {
      this.setState({ dataUrls })
      this.setState({ uploadStatus })
    },
    setImgsLoadStatus: ({ imgsLoadStatus }) => {
      this.setState({ imgsLoadStatus })
    },
    setCanvasLoadStatus: ({ canvasLoadStatus }) => {
      this.setState({ canvasLoadStatus })
    }
  }

  renderImgList = () => {
    return <ImageList ref={this.imageRef} dataUrls={this.state.dataUrls} />
  }
  renderCanvas = () => {
    if (this.state.imgsLoadStatus && this.imageRef.current !== null) {
      return <Canvas forwardedRef={this.imageRef}> </Canvas>
      // Two more ways to forward refs. Look in Notion for notes (search for "forwarding refs")
    }
  }
  renderUploadButton = () => {
    return <UploadImages />
  }

  uploadButtonControl = () => {
    return this.state.uploadStatus
      ? this.renderImgList()
      : this.renderUploadButton()
  }

  canvasRenderControl = () => {
    //both <ImageList/> and <UploadButton/> won't render after canvas has rendered
    if (!this.state.canvasLoadStatus) {
      if (!this.state.imgsLoadStatus) {
        return this.uploadButtonControl()
      } else {
        if (this.state.uploadStatus) {
          // but if images have uploaded AND loaded, render <ImageList/>
          return this.renderImgList()
        }
      }
    }
  }

  render() {
    return (
      <DataContext.Provider value={this.state}>
        <main>
          {this.canvasRenderControl()}
          {/* <ImageList/> will be rendered and <Canvas/> will use the images (and ref) after which canvasLoadStatus will change. Then this.canvasRenderControl will not return anything*/}
          {this.renderCanvas()}
        </main>
      </DataContext.Provider>
    )
  }
}
