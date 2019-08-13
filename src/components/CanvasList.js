import React, { Component, Fragment } from 'react'
import DataContext from '../context/DataContext'
import ProcessedCanvas from './ProcessedCanvas'
import { calculateDimensions } from '../utils/'
import Resize from '../common/ResizeForm'

class CanvasList extends Component {
  static contextType = DataContext
  canvasRefs = []
  canvasDivRef = null
  state = {
    canvases: [],
    images: [],
    canvasLoadStatus: false,
    clickStatus: false,
    maxWidth: 0
  }

  componentDidMount() {
    if (this.canvasDivRef) {
      this.context.setContextState({
        canvasDivRef: this.canvasDivRef
      })
    }
    this.processImages(this.context.dataUrls)
  }

  componentDidUpdate(prevProps, prevState) {
    const currStatus = this.state.canvasLoadStatus,
      prevStatus = prevState.canvasLoadStatus,
      images = this.state.images,
      imgsLen = images.length

    if (currStatus === prevStatus) return
    const dimensions = calculateDimensions(this.state.images)
    const newContextState = { dimensions }
    this.setState({ maxWidth: dimensions.w.max })
    newContextState.canvasLoadStatus = this.state.canvasLoadStatus
    this.context.setContextState(newContextState)

    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      this.drawCanvas(img, i)
    }
  }

  processImages = dataUrls => {
    const images = [],
      canvases = [],
      len = dataUrls.length

    for (let i = 0; i < len; i++) {
      const img = new Image()
      img.src = dataUrls[i]
      img.className += 'images'
      images.push(img)
      // eslint-disable-next-line no-loop-func
      img.onload = () => {
        const canvas = this.createCanvas(img, i)
        canvases.push(canvas)
        if (i === len - 1) {
          this.setState({
            images,
            canvases,
            canvasLoadStatus: true
          })
        }
      }
    }
  }

  createCanvas = (img, i) => {
    const canvas = (
      <canvas
        key={i}
        width={img.width}
        height={img.height}
        className='canvas-item'
        ref={ref => {
          this.canvasRefs[i] = ref
        }}
      />
    )
    return canvas
  }

  drawCanvas = (img, i) => {
    const canvas = this.canvasRefs[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }

  render() {
    return (
      <Fragment>
        {this.state.clickStatus && <ProcessedCanvas />}

        <div
          ref={e => {
            this.canvasDivRef = e
          }}
          className='canvas-wrapper'
          style={{ maxWidth: this.state.maxWidth }}>
          {this.state.canvases}
        </div>
        {/* {!this.state.clickStatus && this.state.canvasLoadStatus && ( */}
        <aside className='aside'>
          <Resize />
          <div className='button-container'>
            <button
              onClick={e => {
                this.setState(prevState => ({
                  clickStatus: !prevState.clickStatus
                }))
              }}>
              Stitch n Slice
            </button>
          </div>
        </aside>
        {/* )} */}
      </Fragment>
    )
  }
}

export default CanvasList
