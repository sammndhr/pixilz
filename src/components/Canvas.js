import React, { Component } from 'react'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'

export default class Canvas extends Component {
  canvasRefs = {}
  divRef = React.createRef()
  state = { canvases: [], blobs: [] }

  componentDidMount() {
    const dataUrls = this.props.imgUrls
    console.log(this.props)

    for (let i = 0; i < dataUrls.length; i++) {
      const img = this.createImage(dataUrls[i], i)
      img.onload = () => {
        this.createCanvas(img, i)
        this.drawCanvas(img, i)
      }
    }
  }
  handleLoad = () => {}
  createImage = (data, i) => {
    const alt = `Image ${i}`
    const img = (
      <img
        src={data}
        alt={alt}
        className='images'
        key={i}
        onLoad={this.handleLoad}
      />
    )
    return img
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
      return newState.canvases.push(canvas)
    })
  }

  drawCanvas = (img, i) => {
    const canvas = this.canvasRefs[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    this.getCanvasBlob(canvas, 'image/jpeg', 1).then(
      blob => {
        this.setState(prevState => {
          const newState = prevState
          return newState.blobs.push(blob)
        })
      },
      err => {
        console.log(err)
      }
    )
  }

  handleClick = () => {
    const blobs = this.state.blobs
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
