import React, { Component, Fragment } from 'react'
// import ImageList from './ImageList'
import { Zip } from '../utils'
import { saveAs } from 'file-saver'
import DataContext from '../context/DataContext'
import stitchProcessing from '../utils/stitchProcressing.js'
export default class Canvas extends Component {
  /*this.props.forwardedRef.current is good for read only(here, just need to read the images and not change anything) since props are immutable. Otherwise you need to clone the ReactElement, Relevant SO: https://stackoverflow.com/a/50441271*/

  static contextType = DataContext

  state = {
    blobs: [],
    totalHeight: 0,
    avgHeight: 0
  }
  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(newProps) {
    console.log(this.context.canvasDivRef)
  }

  componentDidMount() {
    const { canvasDivRef, avgHeight } = this.context
    const canvasList = Array.from(canvasDivRef.children)
    stitchProcessing(canvasList, avgHeight)
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

  render() {
    return (
      <Fragment>
        <div className='wrapper1'>
          <div id='testo' />
          <button onClick={this.handleDownloadClick}>Download</button>
        </div>
      </Fragment>
    )
  }
}
