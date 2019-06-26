import React, { Component } from 'react'
import test01 from '../images/test01.jpg'
import test02 from '../images/test02.jpg'

export default class Canvas extends Component {
  canvasRef = React.createRef()
  imgRef = React.createRef()
  divRef = React.createRef()

  drawCanvas = () => {
    const canvas = this.canvasRef.current
    const img = this.imgRef.current
    const imgWrapperDiv = this.divRef.current.children
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    let totalHeight = 0
    for (let i = 0; i < imgWrapperDiv.length; i++) {
      const img = imgWrapperDiv[i]
      totalHeight += img.height
    }
    canvas.height = totalHeight
    let h = 0
    for (let i = 0; i < imgWrapperDiv.length; i++) {
      const img = imgWrapperDiv[i]
      img.onload = () => {
        ctx.drawImage(img, 0, h, img.width, img.height)
        h += img.height
      }
    }
  }

  componentDidMount() {
    this.drawCanvas()
  }
  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} className='canvas' />
        <div className='images' ref={this.divRef} style={{ display: 'none' }}>
          <img id='test1' ref={this.imgRef} src={test01} alt='test01' />
          <img id='test2' src={test02} alt='test02' />
        </div>
      </div>
    )
  }
}
