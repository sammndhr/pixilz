import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import DataContext from '../context/DataContext'
import { Button } from '../smallComponents/Button'
import Resize from '../smallComponents/ResizeForm'
import StitchPrefForm from '../smallComponents/StitchPrefForm'
import { calculateDimensions } from '../utils/'
import ImageList from './ImageList'
import ProcessedCanvas from './ProcessedCanvas'

const CanvasList = () => {
  const { state, dispatch } = useContext(DataContext)
  const {
    dimensions,
    imgsWrapperRef,
    dataUrls,
    canvasesLoaded,
    canvases,
    imgResizeWidth
  } = state
  const images = imgsWrapperRef ? imgsWrapperRef.children : []
  const [clickStatus, setClickStatus] = useState(false)
  const [imgsResizeDimensions, setImgsResizeDimensions] = useState([])
  const [canvasesDrawn, setCanvasesDrawn] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const [resizePrefs, setResizePrefs] = useState({
    scaleDown: true,
    scaleUp: false
  })

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
  }, [dispatch, showLoader])

  //Images get resized here if they're different sizes
  useEffect(() => {
    const imgsLen = images.length
    if (!canvasesLoaded || canvasesDrawn || !imgsResizeDimensions.length) return
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
      dispatch({
        type: 'UPDATE_IMG_RESIZE_WIDTH',
        payload: dimensions.width.min
      })
    }
  }, [dimensions, imgResizeWidth, dispatch])

  useEffect(() => {
    const cleanup = () => {
      dispatch({ type: 'SET_DATA_URLS', payload: [] })
      dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: false })
      dispatch({ type: 'UPDATE_IMGS_LOAD_STATUS', payload: false })
    }
    return cleanup
  }, [dispatch])

  const handleSizeChange = resizePrefs => {
    setResizePrefs(resizePrefs)
    if (!dimensions.width) return
    if (resizePrefs.scaleDown) {
      dispatch({
        type: 'UPDATE_IMG_RESIZE_WIDTH',
        payload: dimensions.width.min
      })
    } else {
      dispatch({
        type: 'UPDATE_IMG_RESIZE_WIDTH',
        payload: dimensions.width.max
      })
    }
  }

  const handleStitchPrefsChange = stitchPrefs => {
    dispatch({
      type: 'UPDATE_STITCH_PREFS',
      payload: stitchPrefs
    })
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

  const handleClick = () => {
    setShowLoader(true)
    resizeImages()
    setClickStatus(true)
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
        dispatch({ type: 'SET_CANVASES', payload: canvases })
        dispatch({
          type: 'UPDATE_CANVASES_LOADED',
          payload: true
        })
      }
    }
  }

  return (
    <Fragment>
      {!clickStatus && (
        <Fragment>
          <div className='aside-wrapper'>
            <aside className='aside'>
              <StitchPrefForm
                handleStitchPrefsChange={handleStitchPrefsChange}
              />
              <Resize
                handleClick={handleClick}
                handleSizeChange={handleSizeChange}
              />
              <Button handleClick={handleClick} content='Process Images' />
            </aside>
          </div>
          <ImageList />
        </Fragment>
      )}
      {clickStatus && canvasesDrawn && <ProcessedCanvas />}
      {clickStatus && !canvasesDrawn && (
        <div
          ref={canvasesWrapperRef}
          className='canvases-wrapper'
          style={{ maxWidth: dimensions.width.max }}
        >
          {canvases}
        </div>
      )}
    </Fragment>
  )
}

export default CanvasList
