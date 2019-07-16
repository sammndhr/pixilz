import React, { Component, Fragment } from 'react'
import DataContext from '../context/DataContext'
import { withRouter } from 'react-router'

class CanvasList extends Component {
  static contextType = DataContext
  canvasRefs = []

  state = {
    canvases: [],
    images: [],
    totalHeight: 0,
    canvasLoadStatus: false
  }

  componentDidMount() {
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
      len = dataUrls.length

    for (let i = 0; i < len; i++) {
      const img = new Image()
      img.src = dataUrls[i]
      img.className += 'images'
      images.push(img)
      // eslint-disable-next-line no-loop-func
      img.onload = () => {
        totalHeight += img.height
        this.createCanvas(img, i)
        if (i === len - 1) {
          this.setState({ totalHeight, images, canvasLoadStatus: true }, () => {
            this.setAverageHeight(this.state.totalHeight, len)
          })
        }
      }
    }
  }

  setAverageHeight = (height, count) => {
    this.setState({ avgHeight: Math.round(height / count) })
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

    this.setState(prevState => {
      const newState = prevState
      newState.canvases.push(canvas)
      return newState //canvases is what will get rendered
    })
  }

  drawCanvas = (img, i) => {
    const canvas = this.canvasRefs[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }

  handleClick = history => {
    console.log(history)
  }
  renderButton = history => {
    return (
      <button
        onClick={e => {
          this.handleClick(history)
        }}>
        Stitch n Slice
      </button>
    )
  }

  render() {
    const { history } = this.props
    return (
      <Fragment>
        {this.renderButton(history)}
        <div
          ref={currRef => {
            this.context.canvasDivRef = currRef
          }}
          className='canvas-wrapper'>
          {this.state.canvases}
        </div>
      </Fragment>
    )
  }
}

export default withRouter(CanvasList)

// export default CanvasList
