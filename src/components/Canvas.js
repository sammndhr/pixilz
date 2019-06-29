import React, { Component } from 'react'
import test01 from '../images/test01.jpg'
import test02 from '../images/test02.jpg'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'

export default class Canvas extends Component {
  canvasRefs = {}
  divRef = React.createRef()
  state = { canvases: [], blobs: [] }

  componentDidMount() {
    const images = [...this.divRef.current.children]
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      img.onload = () => {
        this.createCanvas(img, i)
        this.drawCanvas(img, i)
      }
    }
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
        <div className='images' ref={this.divRef} style={{ display: 'none' }}>
          <img id='test1' src={test01} alt='test01' />
          <img id='test2' src={test02} alt='test02' />
        </div>
      </div>
    )
  }
}
