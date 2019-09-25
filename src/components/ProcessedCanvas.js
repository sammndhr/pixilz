import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { Zip } from '../utils'
import DataContext from '../context/DataContext'
import { stitchProcessing } from '../utils/'
import { Button } from '../common/Button'

class ProcessedCanvas extends Component {
  static contextType = DataContext
  canvasRefs = []
  state = {
    processedCanvases: [],
    blobs: [],
    avgHeight: 0,
    canvasProcessStatus: false
  }
  componentDidUpdate(prevProps, prevState) {
    const { state, dispatch } = this.context
    const { canvasesWrapperRef, dimensions } = state

    if (!dimensions.width || !dimensions.height) return
    if (!canvasesWrapperRef) return

    const canvasList = Array.from(canvasesWrapperRef.children),
      { processedCanvases } = stitchProcessing(
        canvasList,
        this.canvasRefs,
        dimensions
      )

    if (!this.state.processedCanvases.length) {
      this.setState({
        processedCanvases,
        canvasProcessStatus: true
      })
      dispatch({
        type: 'UPDATE_CANVAS_PROCESS_STATUS',
        payload: true
      })
    }

    const currStatus = this.state.canvasProcessStatus,
      prevStatus = prevState.canvasProcessStatus,
      canLen = processedCanvases.length,
      blobs = []

    if (currStatus === prevStatus) return

    for (let j = 0; j < canLen; j++) {
      const { sourceCan, i, width, height } = processedCanvases[j]
      if (i === j) {
        const canvas = this.canvasRefs[i]
        this.drawCanvas(canvas, {
          sourceCan,
          i,
          width,
          height
        })
        const blob = this.getCanvasBlob(canvas, 'image/jpeg', 1).then(
          blob => {
            return blob
          },
          err => {
            console.error(err)
          }
        )
        blobs.push(blob)
      }
    }
    this.setState({
      blobs
    })

    if (this.props.history.location.pathname !== '/download') {
      this.pushToHistoryState(this.props.history)
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.context

    dispatch({
      type: 'UPDATE_CANVAS_PROCESS_STATUS',
      payload: false
    })
    dispatch({
      type: 'UPDATE_CANVASES_LOADED',
      payload: false
    })
  }

  pushToHistoryState = history => {
    history.push('/download')
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

  drawCanvas = (canvas, { sourceCan, i, width, height }) => {
    const ctx = canvas.getContext('2d')
    ctx.drawImage(sourceCan, 0, 0, width, height, 0, 0, width, height)
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
        {!this.context.state.loader && (
          <Fragment>
            <div>
              <aside className='aside'>
                <div className='button-container'>
                  <div className='form options'>
                    <fieldset className='form-group'>
                      <Button
                        handleClick={this.handleDownloadClick}
                        content='Download'
                      />
                    </fieldset>
                  </div>
                </div>
              </aside>
            </div>
            <div className='canvases-wrapper' id='processed-canvases'>
              {this.state.processedCanvases.map((processedCan, i) => {
                return processedCan.canvas
              })}
            </div>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default withRouter(ProcessedCanvas)
