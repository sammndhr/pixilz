import { saveAs } from 'file-saver'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import DataContext from '../context/DataContext'
import { Button } from '../smallComponents/Button'
import DownloadForm from '../smallComponents/DownloadForm'
import Warning from '../smallComponents/Warning'
import { Zip } from '../utils'
import { stitchOnly, stitchProcessing, useWindowSize } from '../utils/'

const ProcessedCanvas = ({ history }) => {
  const size = useWindowSize(),
    { state, dispatch } = useContext(DataContext),
    {
      canvasesWrapperRef,
      dimensions,
      stitchPrefs,
      imgResizeWidth,
      folderName
    } = state,
    canvasRefs = useRef([]),
    wrapper = useRef(null),
    [processedCanvasesState, setProcessedCanvasesState] = useState([]),
    [blobs, setBlobs] = useState([]),
    [canvasProcessStatus, setCanvasProcessStatus] = useState(false),
    [canvasesDrawn, setCanvasesDrawn] = useState(false),
    [canvasesCreated, setCanvasesCreated] = useState(false),
    [canvases, setCanvases] = useState([]),
    [displaySizeWarning, setDisplaySizeWarning] = useState(false)

  useEffect(() => {
    const canvases = canvasRefs.current,
      canLen = canvases.length,
      resizeImages = newWidth => {
        for (let i = 0; i < canLen; i++) {
          const canvas = canvasRefs.current[i]
          canvas.style.width = `${newWidth}px`
        }
      }

    if (canvasesDrawn) {
      const padding = 3 * 24
      let asideWidth = 0
      if (size.width > 1067) {
        asideWidth = 453.142 + padding
      }

      const windowWidth = size.width - asideWidth
      let reSizeWidth = imgResizeWidth

      if (windowWidth < imgResizeWidth) {
        reSizeWidth = windowWidth
      }
      if (reSizeWidth !== imgResizeWidth) {
        setDisplaySizeWarning(true)
        resizeImages(reSizeWidth)
      } else {
        setDisplaySizeWarning(false)
      }
    }
  }, [canvasesDrawn, imgResizeWidth, size.width])

  useEffect(() => {
    dispatch({ type: 'SHOW_LOADER', payload: !canvasesDrawn })
  }, [canvasesDrawn, dispatch])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return
    if (!canvasesWrapperRef) return

    const canvasList = Array.from(canvasesWrapperRef.children),
      { processedCanvases } = stitchPrefs.stitchOnly
        ? stitchOnly(canvasList, canvasRefs)
        : stitchProcessing(canvasList, canvasRefs, dimensions)

    if (!processedCanvasesState.length) {
      setProcessedCanvasesState(processedCanvases)
      setCanvasProcessStatus(true)
    }
  }, [
    canvasesWrapperRef,
    dimensions,
    processedCanvasesState.length,
    stitchPrefs.stitchOnly
  ])

  //create canvases
  useEffect(() => {
    if (!canvasProcessStatus) return
    const canLen = processedCanvasesState.length,
      canvases = [],
      createCanvas = (i, width, height) => {
        const canvas = (
          <canvas
            key={i}
            width={width}
            height={height}
            className='processed-canvas'
            ref={ref => {
              canvasRefs.current[i] = ref
            }}
          />
        )
        return canvas
      }
    for (let j = 0; j < canLen; j++) {
      const { i, width, height } = processedCanvasesState[j],
        canvas = createCanvas(i, width, height)
      canvases.push(canvas)

      if (j === canLen - 1) {
        setCanvases(canvases)
        setCanvasesCreated(true)
      }
    }
  }, [canvasProcessStatus, processedCanvasesState])

  // draw canvases
  useEffect(() => {
    const canLen = processedCanvasesState.length,
      blobs = []
    if (!canvasesCreated || !canvases.length) return
    const drawCanvas = ({ sourceCan, i, width, height }) => {
        const canvas = canvasRefs.current[i]
        const ctx = canvas.getContext('2d', { alpha: false })
        ctx.drawImage(sourceCan, 0, 0, width, height, 0, 0, width, height)
      },
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
      },
      pushToHistoryState = history => {
        history.push('/download')
      }

    for (let j = 0; j < canLen; j++) {
      const { sourceCan, i, width, height } = processedCanvasesState[j]
      if (i === j) {
        drawCanvas({
          sourceCan,
          i,
          width,
          height
        })
        const canvas = canvasRefs.current[i]
        // const blob = getCanvasBlob(canvas, 'image/jpeg', 1).then( //images are ~2X if quality if set to 1
        const blob = getCanvasBlob(canvas, 'image/jpeg').then(
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
    setBlobs(blobs)

    setCanvasesDrawn(true)
    if (history.location.pathname !== '/download') {
      pushToHistoryState(history)
    }
  }, [canvases, canvasesCreated, history, processedCanvasesState])

  const handleDownloadClick = () => {
    Promise.all(blobs).then(blobs => {
      const files = [],
        fileNameLen = blobs.length.toString().length

      blobs.forEach((blob, i) => {
        let name = `${i}`
        const stream = function() {
          return new Response(blob).body
        }
        while (name.length < fileNameLen) {
          name = `0${name}`
        }
        const file = {
          name: name + '.jpeg',
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
        saveAs(blob, `${folderName}.zip`)
      })
    })
  }
  return (
    <Fragment>
      <div className='aside-wrapper'>
        <aside className='aside'>
          <DownloadForm canvasesDrawn={canvasesDrawn} />
          <Button handleClick={handleDownloadClick} content='Download as Zip' />
        </aside>
      </div>
      <div>
        {displaySizeWarning ? (
          <Warning
            text={`Displayed size isn't the final size. Please expand browser to view exact size.`}
          />
        ) : null}
        <div className='canvases-wrapper' ref={wrapper} id='processed-canvases'>
          {canvases.map(canvas => {
            return canvas
          })}
        </div>
      </div>
    </Fragment>
  )
}
export default withRouter(ProcessedCanvas)
