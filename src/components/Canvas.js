import React, { Component, Fragment } from 'react'
// import ImageList from './ImageList'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'
import DataContext from '../context/DataContext'

export default class Canvas extends Component {
  /*this.props.forwardedRef.current is good for read only(here, just need to read the images and not change anything) since props are immutable. Otherwise you need to clone the ReactElement, Relevant SO: https://stackoverflow.com/a/50441271*/

  static contextType = DataContext
  canvasRefs = []
  state = {
    blobs: [],
    canvases: [],
    canvasLoadStatus: false,
    totalHeight: 0,
    avgHeight: 0
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
    let totalHeight = 0
    for (let i = 0; i < len; i++) {
      const img = images[i]
      totalHeight += img.height
      this.createCanvas(img, i)
      if (i === len - 1) {
        this.setState(prevState => ({
          canvasLoadStatus: !prevState.canvasLoadStatus
        }))
      }
    }
    this.setState({ totalHeight }, () => {
      this.setAverageHeight(this.state.totalHeight, len)
    })
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
  handleDownloadClick = () => {
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

  handleClick = () => {
    const attachSlicedImg = canvas => {
      document.getElementById('testo').append(canvas)
    }

    const combineSlicedImgs = arr => {
      const canvas = document.createElement('canvas')
      const canvases = []
      let joinedHeight = 0,
        joinedWidth = 0
      for (let i = 0; i < arr.length; i++) {
        const cvs = arr[i],
          cvsObj = {
            canvas: cvs,
            oWidth: cvs.width,
            oHeight: cvs.height
          }
        joinedWidth = cvs.width

        canvases.push(cvsObj)
      }
      for (let i = 0; i < canvases.length; i++) {
        const cvsObj = canvases[i]
        cvsObj.nWidth = joinedWidth

        cvsObj.nHeight = (cvsObj.nWidth * cvsObj.oHeight) / cvsObj.oWidth
        joinedHeight += cvsObj.nHeight
      }

      canvas.width = joinedWidth
      canvas.height = joinedHeight
      const ctx = canvas.getContext('2d'),
        Left = 0
      let Top = 0
      for (let i = 0; i < canvases.length; i++) {
        ctx.drawImage(canvases[i].canvas, Left, Top)
        Top += canvases[i].nHeight
      }

      return canvas
    }

    const combineSmallerImgs = (first, height, images) => {
      let comb = first
      while (comb.height < height && images.length >= 1) {
        const next = images.shift()
        comb = combineSlicedImgs([comb, next])
      }
      return comb
    }

    const comparePixels = (old, curr) => {
      const threshold = 0
      const diff = Math.sqrt(
        Math.pow(curr.r - old.r, 2) +
          Math.pow(curr.g - old.g, 2) +
          Math.pow(curr.b - old.b, 2)
      )
      return !(diff > threshold)
    }

    const verifyLastRowColor = (canvas, avgH) => {
      const height = avgH || canvas.height,
        { width } = canvas,
        ctx = canvas.getContext('2d'),
        { data } = ctx.getImageData(0, height - 1, width, 1)

      let curr, 
       prev,
        slice = true,
        currPixel = 0

      const NEXT_PIXEL = 4,
        red = 0,
        green = 1,
        blue = 2,
        alpha = 3

      while (currPixel < data.length) {
        curr = {
          r: data[currPixel + red],
          g: data[currPixel + green],
          b: data[currPixel + blue],
          a: data[currPixel + alpha]
        }

        if (!!prev && !comparePixels(prev, curr)) return 

        prev = curr
        currPixel += NEXT_PIXEL
      }
      return slice
    }

    const sliceCanvas = (combCan, sliceHeight) => {
      const { height, width } = combCan,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        remainingCan = document.createElement('canvas'),
        remainingH = height - sliceHeight,
        rCtx = remainingCan.getContext('2d')

      canvas.width = width
      canvas.height = sliceHeight
      remainingCan.width = width
      remainingCan.height = remainingH
      ctx.drawImage(combCan, 0, 0, width, sliceHeight, 0, 0, width, sliceHeight)

      attachSlicedImg(canvas)
      rCtx.drawImage(
        combCan,
        0,
        sliceHeight - 1,
        width,
        remainingH,
        0,
        0,
        width,
        remainingH
      )
      return remainingCan
    }
    const findSLiceLocation = (first, avgHeight) => {
      let sliceHeight = avgHeight
      let remainingCan = first
      while (sliceHeight < first.height) {
        if (verifyLastRowColor(first, sliceHeight) === true) {
          const padding = sliceHeight + 40
          if (
            verifyLastRowColor(first, padding) === true &&
            padding < first.height
          ) {
            sliceHeight = padding
          }
          remainingCan = sliceCanvas(first, sliceHeight)
          break
        }
        sliceHeight += 10
      }
      return remainingCan
    }

    const recurse = (canvases, avgHeight) => {
      const cnvsCopy = canvases
      let first = cnvsCopy.shift()
      first = combineSmallerImgs(first, avgHeight, cnvsCopy)
      if (cnvsCopy.length === 0) {
        attachSlicedImg(first)
        return
      } else if (verifyLastRowColor(first, avgHeight)) {
        if (first.height <= avgHeight) {
          attachSlicedImg(first)
        } else {
          const remainingCan = findSLiceLocation(first, avgHeight)
          cnvsCopy.unshift(remainingCan)
        }
      } else {
        const second = cnvsCopy.shift()
        const combined = combineSlicedImgs([first, second])
        first = combineSmallerImgs(combined, avgHeight, cnvsCopy)
        const remainingCan = findSLiceLocation(first, avgHeight)
        cnvsCopy.unshift(remainingCan)
      }
      recurse(cnvsCopy, avgHeight)
    }
    recurse(this.canvasRefs, this.state.avgHeight)
  }

  render() {
    return (
      <Fragment>
        <div className='wrapper1'>
          <div id='testo' />
          <button onClick={this.handleDownloadClick}>Download</button>
          <button onClick={this.handleClick}>Stitch and Slice</button>
        </div>
        <div className='canvas-wrapper' style={{ display: 'none' }}>
          {this.state.canvases}
        </div>
      </Fragment>
    )
  }
}
