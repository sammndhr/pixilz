import React, { Component } from 'react'
// import ImageList from './ImageList'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'
import DataContext from '../context/DataContext'

export default class Canvas extends Component {
  /*this.props.forwardedRef.current is good for read only(here, just need to read the images and not change anything) since props are immutable. Otherwise you need to clone the ReactElement, Relevant SO: https://stackoverflow.com/a/50441271*/

  static contextType = DataContext
  canvasRefs = {}
  state = {
    blobs: [],
    canvases: [],
    canvasLoadStatus: false
  }

  componentDidUpdate(prevProps, prevState) {
    //gets called after done "rendering" and all the children have been rendered. In componentDidMount, after handling last image, called setState({canvasLoadStatus: true}). So prevState.canvasLoadStatus !== this.state.canvasLoadStatus will be the condition for drawing the canvases and setting context canvasLoadStatus
    const dataContext = this.context
    const images = this.props.forwardedRef.current
    const currStatus = this.state.canvasLoadStatus
    const prevStatus = prevState.canvasLoadStatus

    if (currStatus !== prevStatus) {
      const imagesRef = Array.from(images.children)
      const ImgsRefLen = imagesRef.length
      for (let i = 0; i < ImgsRefLen; i++) {
        const img = imagesRef[i]
        this.drawCanvas(img, i)
      }
      dataContext.setCanvasLoadStatus({
        canvasLoadStatus: this.state.canvasLoadStatus
      })
    }
  }

  componentDidMount() {
    const images = Array.from(this.props.forwardedRef.current.children)
    const len = images.length
    for (let i = 0; i < len; i++) {
      const img = images[i]
      this.createCanvas(img, i)
      if (i === len - 1) {
        this.setState(prevState => ({
          canvasLoadStatus: !prevState.canvasLoadStatus
        }))
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
    this.setState(prevState => {
      const newState = prevState
      newState.canvases.push(canvas)
      return newState //canvases is what will get rendered
    })
  }

  drawCanvas = async (img, i) => {
    const canvas = await this.canvasRefs[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const blob = this.getCanvasBlob(canvas, 'image/jpeg', 1).then(
      blob => {
        return blob
      },
      err => {
        console.log(err)
      }
    )
    this.setState(prevState => {
      const newState = prevState
      newState.blobs.push(blob)
      return newState
    })
  }

  getCanvasBlob = (canvas, mimeType, quality) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          resolve(blob)
        },
        mimeType,
        quality
      )
    })
  }
  handleClick = () => {
    Promise.all(this.state.blobs).then(blobs => {
      const files = []
      blobs.forEach((blob, i) => {
        const stream = function() {
          return new Response(blob).body
        }
        const file = {
          name: `${i}.jpeg`,
          stream
        }
        files.push(file)
      })
      const readableStream = new Zip({
        start(ctrl) {
          files.forEach(file => {
            ctrl.enqueue(file)
          })
          ctrl.close()
        }
      })
      new Response(readableStream).blob().then(blob => {
        saveAs(blob, 'archive.zip')
      })
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Download</button>
        <div className='canvas-wrapper'>{this.state.canvases}</div>
      </div>
    )
  }
}
