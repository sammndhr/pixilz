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
import Resize from '../common/ResizeForm'
import ImageList from './ImageList'
import { calculateDimensions } from '../utils/'

const CanvasList = () => {
  const { state, dispatch } = useContext(DataContext)
  const { dimensions, imgsWrapperRef, dataUrls } = state
  const images = imgsWrapperRef ? imgsWrapperRef.children : []
  const [clickStatus, setClickStatus] = useState(false)
  const [canvases, setCanvases] = useState([])
  const [canvasesLoaded, setCanvasLoadStatus] = useState(false)
  const [imgsResizeDimensions, setImgsResizeDimensions] = useState([])
  const [canvasesDrawn, setCanvasesDrawn] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const [resizePrefs, setResizePrefs] = useState({
    scaleDown: true,
    scaleUp: false
  })
  const [imgResizeWidth, setImgResizeWidth] = useState(0)
  const canvasRefs = useRef([])
  const canvasesWrapperRef = useCallback(
    node => {
      if (node !== null) {
        dispatch({ type: 'UPDATE_CANVASES_WRAPPER_REF', payload: node })
      }
    },
    [dispatch]
  )
  useEffect(() => {
    dispatch({ type: 'SHOW_LOADER', payload: showLoader })
    const cleanup = () => {
      setShowLoader(false)
      dispatch({ type: 'SHOW_LOADER', payload: false })
    }
    return cleanup
  }, [dispatch, showLoader])

  useEffect(() => {
    const imgsLen = images.length
    if (!canvasesLoaded || canvasesDrawn) return
    const drawCanvas = (img, i) => {
      const canvas = canvasRefs.current[i],
        { oWidth, oHeight, nWidth, nHeight } = imgsResizeDimensions[i],
        ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, oWidth, oHeight, 0, 0, nWidth, nHeight)
    }
    for (let i = 0; i < imgsLen; i++) {
      const img = images[i]
      drawCanvas(img, i)
    }
    setCanvasesDrawn(true)
  }, [canvasesLoaded, imgsResizeDimensions, canvasRefs, images, canvasesDrawn])

  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, dataUrls.length)
  }, [dataUrls.length])

  useEffect(() => {
    if (dimensions.width && !imgResizeWidth) {
      setImgResizeWidth(dimensions.width.min)
    }
  }, [dimensions, imgResizeWidth])

  useEffect(() => {
    const cleanup = () => {
      dispatch({ type: 'SET_DATA_URLS', payload: [] })
      dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: false })
      dispatch({ type: 'UPDATE_IMGS_LOAD_STATUS', payload: false })
    }
    return cleanup
  }, [dispatch])

  const handleRadioButtonChange = resizePrefs => {
    setResizePrefs(resizePrefs)
    if (!dimensions.width) return
    if (resizePrefs.scaleDown) {
      setImgResizeWidth(dimensions.width.min)
    } else {
      setImgResizeWidth(dimensions.width.max)
    }
  }

  const resizeImages = () => {
    if (images.length && dimensions.width) {
      const imgsList = Array.from(images),
        imgsLen = imgsList.length,
        imgsResizeDimensions = []
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
      for (let i = 0; i < imgsLen; i++) {
        const img = imgsList[i]
        img.removeAttribute('width')
        const oWidth = img.width
        const oHeight = img.height
        resizeImage(img, img.width)
        const resizeDimension = {
          oWidth,
          oHeight,
          nWidth: img.width,
          nHeight: img.height
        }
        imgsResizeDimensions.push(resizeDimension)
      }
      if (imgsLen) {
        setImgsResizeDimensions(imgsResizeDimensions)
      }
    }
  }

  const handleClick = e => {
    resizeImages()
    setClickStatus(true)
    setShowLoader(true)
    const imgsLen = images.length,
      canvases = [],
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

    dispatch({
      type: 'UPDATE_DIMENSIONS',
      payload: calculateDimensions(images)
    })

    for (let i = 0; i < imgsLen; i++) {
      const img = images[i],
        canvas = createCanvas(img, i)
      canvases.push(canvas)

      if (i === imgsLen - 1) {
        setCanvases(canvases)
        setCanvasLoadStatus(true)
      }
    }
  }

  return (
    <Fragment>
      {!clickStatus && (
        <Fragment>
          <div>
            <aside className='aside'>
              <Resize handleRadioButtonChange={handleRadioButtonChange} />
              <div className='button-container'>
                <button onClick={handleClick}>Stitch n Slice</button>
              </div>
            </aside>
          </div>
          <ImageList imgResizeWidth={imgResizeWidth} />
        </Fragment>
      )}
      {clickStatus && canvasesDrawn && (
        <ProcessedCanvas resizePrefs={resizePrefs} />
      )}
      {clickStatus && !canvasesDrawn && (
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
