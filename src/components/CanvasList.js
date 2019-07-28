import React, { Component, Fragment } from 'react'
import DataContext from '../context/DataContext'
import ProcessedCanvas from './ProcessedCanvas'

class CanvasList extends Component {
  static contextType = DataContext
  canvasRefs = []

  state = {
    canvases: [],
    images: [],
    totalHeight: 0,
    canvasLoadStatus: false,
    clickStatus: false
  }

  componentDidMount() {
    this.context.setContextState({ canvasDivRef: this.refs.canvasDiv })
    this.processImages(this.context.dataUrls)
  }

  componentDidUpdate(prevProps, prevState) {
    const currStatus = this.state.canvasLoadStatus,
      prevStatus = prevState.canvasLoadStatus,
      images = this.state.images,
      imgsLen = images.length

    if (currStatus === prevStatus) return
    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      this.drawCanvas(img, i)
    }
  }

  processImages = dataUrls => {
    let totalHeight = 0
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
        totalHeight += img.height
        const canvas = this.createCanvas(img, i)
        canvases.push(canvas)
        if (i === len - 1) {
          this.setState({
            totalHeight,
            images,
            canvases,
            canvasLoadStatus: true,
            avgHeight: Math.round(totalHeight / len)
          })
          this.context.setContextState({
            avgHeight: Math.round(totalHeight / len),
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
        className='canvas'
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
        {!this.state.clickStatus && this.state.canvasLoadStatus && (
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
        )}

        {this.state.clickStatus && <ProcessedCanvas />}

        <div ref='canvasDiv' className='canvas-wrapper'>
          {this.state.canvases}
        </div>
      </Fragment>
    )
  }
}

export default CanvasList
