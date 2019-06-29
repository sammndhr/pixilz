import React, { Component } from 'react'
import test01 from '../images/test01.jpg'
import test02 from '../images/test02.jpg'

export default class Canvas extends Component {
  canvasRefs = {}
  divRef = React.createRef()
  state = { canvases: [] }

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
  }

  handleClick = () => {
    const click = function(node) {
      var event = new MouseEvent('click')
      node.dispatchEvent(event)
    }
    for (const key in this.canvasRefs) {
      if (this.canvasRefs.hasOwnProperty(key)) {
        const canvas = this.canvasRefs[key]
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${key}.png`
        link.href = url
        click(link) //link.click() doesn't work on all browsers
      }
    }
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
