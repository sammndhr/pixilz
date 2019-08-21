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
  const { state, dispatch } = useContext(DataContext)
  const {
    dimensions,
    imgsWrapperRef,
    resizePrefs,
    imgsLoaded,
    dataUrls
  } = state
  const [clickStatus, setClickStatus] = useState(false)
  const [canvases, setCanvases] = useState([])
  const [canvasesLoaded, setCanvasLoadStatus] = useState(false)
  const [imgsResizeDimensions, setImgsResizeDimensions] = useState([])

  const canvasRefs = useRef([])

  useEffect(() => {
    if (dataUrls.length === canvases.length) return
    const resizeImage = (img, oWidth) => {
      const minWidth = dimensions.width.min,
        maxWidth = dimensions.width.max
      if (resizePrefs.scaleDown === true && oWidth > minWidth) {
        img.width = minWidth
      }
      if (resizePrefs.scaleUp === true && oWidth < maxWidth) {
        img.width = maxWidth
      }
      return img
    }

    const createCanvas = imgsWrapperRef => {
      const canvasesLocal = [],
        imgsResizeDimensions = [],
        imgsList = Array.from(imgsWrapperRef.children),
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

    if (!imgsLoaded || !dimensions.width) return
    if (imgsWrapperRef !== null) {
      createCanvas(imgsWrapperRef, dimensions)
    }
  }, [imgsWrapperRef, dataUrls, imgsLoaded, dimensions, resizePrefs, canvases])

  const canvasesWrapperRef = useCallback(
    node => {
      if (node !== null) {
        dispatch({ action: 'UPDATE_CANVASES_WRAPPER_REF', payload: node })
      }
    },
    [dispatch]
  )

  useEffect(() => {
    const drawCanvas = (img, i) => {
      const canvas = canvasRefs.current[i],
        { oWidth, oHeight, nWidth, nHeight } = imgsResizeDimensions[i],
        ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, oWidth, oHeight, 0, 0, nWidth, nHeight)
    }
    if (imgsWrapperRef === null || !clickStatus) return
    const images = imgsWrapperRef.children,
      imgsLen = images.length
    if (!canvasesLoaded) return
    dispatch({ action: 'UPDATE_CANVASES_LOADED', payload: canvasesLoaded })

    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      drawCanvas(img, i)
    }
  }, [
    canvasesLoaded,
    imgsWrapperRef,
    clickStatus,
    imgsResizeDimensions,
    dispatch
  ])

  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, dataUrls.length)
  }, [dataUrls.length])

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
          <ImageList />
        </Fragment>
      )}
      {/* {clickStatus && <ProcessedCanvas />} */}
      {clickStatus && (
        <div
          ref={canvasesWrapperRef}
          className='canvases-wrapper'
          style={{ maxWidth: dimensions.width.max }}>
          {canvases}
        </div>
      )}
    </Fragment>
  )
}

export default CanvasList
