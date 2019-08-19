import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
import ProcessedCanvas from './ProcessedCanvas'
import { calculateDimensions } from '../utils/'
import Resize from '../common/ResizeForm'

const CanvasList = () => {
  const dataContext = useContext(DataContext)
  const [clickStatus, setClickStatus] = useState(false)
  const [canvases, setCanvases] = useState([])
  const [images, setImages] = useState([])
  const [imgCount, setImgCount] = useState(0)
  const [canvasLoadStatus, setCanvasLoadStatus] = useState(false)
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const canvasRefs = useRef([])

  const canvasDivRef = useCallback(node => {
    if (node !== null) {
      dataContext.setContextState({
        canvasDivRef: node
      })
    }
    //adding dataContext as a dependency will cause maximum call stack error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createCanvas = (img, i) => {
    const canvas = (
      <canvas
        key={i}
        width={img.width}
        height={img.height}
        className='canvas-item'
        ref={el => {
          canvasRefs.current[i] = el
        }}
      />
    )
    return canvas
  }

  const drawCanvas = (img, i) => {
    const canvas = canvasRefs.current[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }

  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, imgCount)
  }, [imgCount])

  useEffect(() => {
    const processImages = async dataUrls => {
      const imgsArr = [],
        canvases = [],
        len = dataUrls.length
      for (let i = 0; i < len; i++) {
        const img = new Image()
        img.src = dataUrls[i]
        img.className += 'imgsArr'
        imgsArr.push(img)
        img.onload = () => {
          const canvas = createCanvas(img, i)
          canvases.push(canvas)
          if (i === len - 1) {
            setImages(imgsArr)
            setCanvases(canvases)
            setCanvasLoadStatus(true)
            setImgCount(len)
          }
        }
      }
    }
    if (!dataContext.dataUrls) return
    processImages(dataContext.dataUrls)
  }, [dataContext.dataUrls])

  useEffect(() => {
    const imgsLen = images.length
    if (!canvasLoadStatus) return
    const dimensions = calculateDimensions(images)
    setMaxWidth(dimensions.w.max)
    setDimensions(dimensions)
    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      drawCanvas(img, i)
    }
  }, [canvasLoadStatus, images])

  useEffect(() => {
    const newContextState = { dimensions }
    newContextState.canvasLoadStatus = canvasLoadStatus
    dataContext.setContextState(newContextState)
    const cleanup = () => {
      dataContext.setContextState({ canvasLoadStatus: false })
    }
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, canvasLoadStatus])

  return (
    <Fragment>
      {!clickStatus && canvasLoadStatus && (
        <aside className='aside'>
          <Resize />
          <div className='button-container'>
            <button
              onClick={e => {
                setClickStatus(true)
              }}>
              Stitch n Slice
            </button>
          </div>
        </aside>
      )}
      {clickStatus && <ProcessedCanvas />}
      <div ref={canvasDivRef} className='canvas-wrapper' style={{ maxWidth }}>
        {canvases}
      </div>
    </Fragment>
  )
}

export default CanvasList
