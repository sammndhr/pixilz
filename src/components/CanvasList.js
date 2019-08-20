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
import ImageList from './ImageList'

const CanvasList = () => {
  const data = useContext(DataContext)
  const [clickStatus, setClickStatus] = useState(false)
  const [dataUrlsProps, setDataUrlsProps] = useState([])
  const [canvases, setCanvases] = useState([])
  const [canvasLoadStatus, setCanvasLoadStatus] = useState(false)
  const [imgsDivRef, setImgsDivRef] = useState(null)
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const canvasRefs = useRef([])

  useEffect(() => {
    if (maxWidth && !data.maxWidth) {
      data.setContextState({ dimensions, maxWidth })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, maxWidth, data.maxWidth])

  useEffect(() => {
    if (data.dataUrls.length && !dataUrlsProps.length) {
      setDataUrlsProps(data.dataUrls)
    }
  }, [data.dataUrls, dataUrlsProps])

  useEffect(() => {
    if (!data.imgsLoadStatus) return
    if (data.imgsDivRef !== null) {
      setImgsDivRef(data.imgsDivRef)
    }
  }, [data.imgsDivRef, data.imgsLoadStatus])

  useEffect(() => {
    if (!data.imgsLoadStatus) return
    if (imgsDivRef !== null) {
      const canvases = [],
        imgsList = Array.from(imgsDivRef.children),
        imgsLen = imgsList.length,
        dimensions = calculateDimensions(imgsList),
        createCanvas = (img, i) => {
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
      setMaxWidth(dimensions.w.max)
      setDimensions(dimensions)
      for (let i = 0; i < imgsLen; i++) {
        const img = imgsList[i]
        const canvas = createCanvas(img, i)
        canvases.push(canvas)
      }
      if (canvases.length === imgsLen) {
        setCanvases(canvases)
        setCanvasLoadStatus(true)
      }
    }
  }, [imgsDivRef, dataUrlsProps, data.imgsLoadStatus])

  const drawCanvas = (img, i) => {
    const canvas = canvasRefs.current[i]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }
  const canvasDivRef = useCallback(node => {
    if (node !== null) {
      data.setContextState({
        canvasDivRef: node
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (imgsDivRef === null || !clickStatus) return
    const images = imgsDivRef.children
    const imgsLen = images.length
    if (!canvasLoadStatus) return
    data.setContextState({ canvasLoadStatus })
    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      drawCanvas(img, i)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasLoadStatus, imgsDivRef, clickStatus])

  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, dataUrlsProps.length)
  }, [dataUrlsProps.length])

  return (
    <Fragment>
      {!clickStatus && (
        <Fragment>
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
          <ImageList dataUrls={dataUrlsProps} />
        </Fragment>
      )}
      {/* {clickStatus && <ProcessedCanvas />} */}
      {clickStatus && (
        <div ref={canvasDivRef} className='canvas-wrapper' style={{ maxWidth }}>
          {canvases}
        </div>
      )}
    </Fragment>
  )
}

export default CanvasList
