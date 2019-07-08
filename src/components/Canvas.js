import React, { Component } from 'react'
import ImageList from './ImageList'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'

export default class Canvas extends Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
// export default class Canvas extends Component {
//   canvasRefs = {}
//   divRef = React.createRef()
//   state = { canvases: [], blobs: [] }

//   componentDidMount() {
//     console.log('in canvas yo')
//     const images = this.props.images
//     console.log(images.children)
//     console.log('this.props.children', this.props.children)

//     for (let i in images) {
//       // console.log(dataUrls[i])
//       const img = images[i]
//       console.log(img)
//       // img.onload = () => {
//       // this.createCanvas(img, i)
//       // this.drawCanvas(img, i)
//       // }
//     }
//   }
//   handleLoad = () => {
//     console.log('in loaded')
//   }

//   getCanvasBlob = (canvas, mimeType, quality) => {
//     return new Promise((resolve, reject) => {
//       canvas.toBlob(
//         blob => {
//           resolve(blob)
//         },
//         mimeType,
//         quality
//       )
//     })
//   }

//   createCanvas = (img, i) => {
//     console.log(img)
//     const canvas = (
//       <canvas
//         key={i}
//         width={img.width}
//         height={img.height}
//         className='canvas'
//         ref={ref => {
//           this.canvasRefs[i] = ref
//         }}
//       />
//     )
//     this.setState(prevState => {
//       const newState = prevState
//       return newState.canvases.push(canvas)
//     })
//   }

//   drawCanvas = (img, i) => {
//     const canvas = this.canvasRefs[i]
//     const ctx = canvas.getContext('2d')
//     ctx.drawImage(img, 0, 0)
//     this.getCanvasBlob(canvas, 'image/jpeg', 1).then(
//       blob => {
//         this.setState(prevState => {
//           const newState = prevState
//           return newState.blobs.push(blob)
//         })
//       },
//       err => {
//         console.log(err)
//       }
//     )
//   }

//   handleClick = () => {
//     const blobs = this.state.blobs
//     const files = []
//     blobs.forEach((blob, i) => {
//       const stream = function() {
//         return new Response(blob).body
//       }
//       const file = {
//         name: `${i}.jpeg`,
//         stream
//       }
//       files.push(file)
//     })
//     const readableStream = new Zip({
//       start(ctrl) {
//         files.forEach(file => {
//           ctrl.enqueue(file)
//         })
//         ctrl.close()
//       }
//     })
//     new Response(readableStream).blob().then(blob => {
//       saveAs(blob, 'archive.zip')
//     })
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this.handleClick}>Download</button>
//         <div className='canvas-wrapper'>{this.state.canvases}</div>
//       </div>
//     )
//   }
// }
