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
  const { dimensions, imgsWrapperRef, imgsLoaded, dataUrls } = state
  const [clickStatus, setClickStatus] = useState(false)
  const [canvases, setCanvases] = useState([])
  const [canvasesLoaded, setCanvasLoadStatus] = useState(false)
  const [imgsResizeDimensions, setImgsResizeDimensions] = useState([])
  const [resizePrefs, setResizePrefs] = useState({
    scaleDown: true,
    scaleUp: false
  })
  const handleRadioButtonChange = resizePrefs => {
    setResizePrefs(resizePrefs)
  }

  const canvasRefs = useRef([])

  useEffect(() => {
    if (imgsWrapperRef !== null && dimensions.width) {
      const imgsList = Array.from(imgsWrapperRef.children),
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
  }, [
    resizePrefs,
    imgsWrapperRef,
    dimensions.width,
    dataUrls.length,
    canvases.length
  ])

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
            <Resize handleRadioButtonChange={handleRadioButtonChange} />
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
