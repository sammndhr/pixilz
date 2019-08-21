import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
// import ProcessedCanvas from './ProcessedCanvas'
import Resize from '../common/ResizeForm'
import ImageList from './ImageList'

const CanvasList = () => {
  const data = useContext(DataContext)
  const { dimensions, imgsDivRef, resize, imgsLoadStatus } = data
  const [clickStatus, setClickStatus] = useState(false)
  const [dataUrlsProps, setDataUrlsProps] = useState([])
  const [canvases, setCanvases] = useState([])
  const [canvasLoadStatus, setCanvasLoadStatus] = useState(false)
  const [imgsResizeDimensions, setImgsResizeDimensions] = useState([])

  const canvasRefs = useRef([])

  useEffect(() => {
    if (data.dataUrls.length && !dataUrlsProps.length) {
      setDataUrlsProps(data.dataUrls)
    }
  }, [data.dataUrls, dataUrlsProps])

  useEffect(() => {
    if (dataUrlsProps.length === canvases.length) return
    const resizeImage = (img, oWidth) => {
      const minWidth = dimensions.w.min,
        maxWidth = dimensions.w.max
      if (resize.scaleDown === true && oWidth > minWidth) {
        img.width = minWidth
      }
      if (resize.scaleUp === true && oWidth < maxWidth) {
        img.width = maxWidth
      }
      return img
    }

    const createCanvas = imgsDivRef => {
      const canvasesLocal = [],
        imgsResizeDimensions = [],
        imgsList = Array.from(imgsDivRef.children),
        imgsLen = imgsList.length,
        createCanvas = (img, i) => {
          const oWidth = img.width,
            oHeight = img.height,
            resized = resizeImage(img, oWidth)
          const resizeDimension = {
            oWidth,
            oHeight,
            nWidth: resized.width,
            nHeight: resized.height
          }
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
          img.removeAttribute('width')
          return { canvas, resizeDimension }
        }
      for (let i = 0; i < imgsLen; i++) {
        const img = imgsList[i]
        const { canvas, resizeDimension } = createCanvas(img, i)
        canvasesLocal.push(canvas)
        imgsResizeDimensions.push(resizeDimension)
      }
      if (canvasesLocal.length === imgsLen && canvases.length === 0) {
        setCanvases(canvasesLocal)
        setCanvasLoadStatus(true)
        setImgsResizeDimensions(imgsResizeDimensions)
      }
    }

    if (!imgsLoadStatus || !dimensions.w) return
    if (imgsDivRef !== null) {
      createCanvas(imgsDivRef, dimensions)
    }
  }, [imgsDivRef, dataUrlsProps, imgsLoadStatus, dimensions, resize, canvases])

  const canvasDivRef = useCallback(node => {
    if (node !== null) {
      data.setContextState({
        canvasDivRef: node
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const drawCanvas = (img, i) => {
      const canvas = canvasRefs.current[i],
        { oWidth, oHeight, nWidth, nHeight } = imgsResizeDimensions[i],
        ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, oWidth, oHeight, 0, 0, nWidth, nHeight)
    }
    if (imgsDivRef === null || !clickStatus) return
    const images = imgsDivRef.children,
      imgsLen = images.length
    if (!canvasLoadStatus) return
    data.setContextState({ canvasLoadStatus })
    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      drawCanvas(img, i)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasLoadStatus, imgsDivRef, clickStatus, imgsResizeDimensions])

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
        <div
          ref={canvasDivRef}
          className='canvas-wrapper'
          style={{ maxWidth: dimensions.w.max }}>
          {canvases}
        </div>
      )}
    </Fragment>
  )
}

export default CanvasList
