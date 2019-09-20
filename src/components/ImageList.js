import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
import { calculateDimensions, useWindowSize } from '../utils/'
import ImageSizeWarning from '../common/ImageSizeWarning'

const ImageList = ({ imgResizeWidth }) => {
  const size = useWindowSize()
  const { state, dispatch } = useContext(DataContext)
  // const [clickStatus, setClickStatus] = useState(false)
  const { dataUrls } = state

  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const [imgsLoaded, setImgsLoaded] = useState([])
  const [imgsLoadPromises, setImgsLoadPromises] = useState([])
  const [displaySizeWarning, setDisplaySizeWarning] = useState(false)
  const imgsRefs = useRef([])

  const imgsWrapperRef = useCallback(
    node => {
      if (node !== null) {
        dispatch({ type: 'SET_IMGS_WRAPPER_REF', payload: node })
      }
    },
    [dispatch]
  )
  useEffect(() => {
    if (!dataUrls.length) return
    const images = [],
      dataUrlsLen = dataUrls.length
    for (let i = 0; i < dataUrlsLen; i++) {
      const img = dataUrls[i],
        image = (
          <img
            src={img}
            alt={i.toString()}
            key={i}
            ref={el => {
              imgsRefs.current[i] = el
            }}
            onLoad={() => {
              const imgsLoadPromisesCopy = imgsLoadPromises.slice()
              imgsLoadPromisesCopy[i] = new Promise((resolve, reject) => {
                resolve(true)
              })
              setImgsLoadPromises(imgsLoadPromisesCopy)
            }}
          />
        )
      images.push(image)
    }
    if (images.length === dataUrlsLen) {
      setImages(images)
      setImgsLoaded(true)
    }
  }, [dataUrls, imgsLoadPromises])

  useEffect(() => {
    // Can't use images from state because they are React objects
    const images = imgsRefs.current,
      imgsLen = images.length,
      resizeImages = newWidth => {
        for (let i = 0; i < imgsLen; i++) {
          const img = images[i]
          img.width = newWidth
        }
      }

    if (imgsLoaded) {
      const dimensions = calculateDimensions(images, true),
        padding = 3 * 24
      let asideWidth = 0
      if (size.width > 1067) {
        asideWidth = 453.142 + padding
      }
      const windowWidth = size.width - asideWidth
      let reSizeWidth = imgResizeWidth
      setMaxWidth(dimensions.width.max) //multiply by 4 cause Material UI does it that way
      setDimensions(dimensions)
      if (windowWidth < imgResizeWidth) {
        reSizeWidth = windowWidth
      }
      if (reSizeWidth !== imgResizeWidth) {
        setDisplaySizeWarning(true)
      } else {
        setDisplaySizeWarning(false)
      }
      resizeImages(reSizeWidth)
    }
  }, [imgsRefs, imgsLoaded, size, imgResizeWidth])

  useEffect(() => {
    if (!imgsLoaded) return
    dispatch({ type: 'UPDATE_IMGS_LOAD_STATUS', payload: imgsLoaded })
    const cleanup = () => {
      dispatch({ type: 'UPDATE_IMGS_LOAD_STATUS', payload: false })
    }
    return cleanup
  }, [imgsLoaded, dispatch])

  useEffect(() => {
    dispatch({ type: 'UPDATE_DIMENSIONS', payload: dimensions })
  }, [dimensions, dispatch])

  useEffect(() => {
    if (dataUrls.length && dataUrls.length === imgsLoadPromises.length) {
      Promise.all(imgsLoadPromises).then(() => {
        setImgsLoaded(true)
      })
    }
  }, [dataUrls, imgsLoadPromises])

  return (
    <Fragment>
      <div className='images-wrapper' ref={imgsWrapperRef} style={{ maxWidth }}>
        {displaySizeWarning ? <ImageSizeWarning /> : null}
        {images}
      </div>
    </Fragment>
  )
}

export default ImageList
