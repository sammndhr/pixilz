import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
import { calculateDimensions } from '../utils/'

const ImageList = () => {
  const { state, dispatch } = useContext(DataContext)

  // const [clickStatus, setClickStatus] = useState(false)
  const { dataUrls } = state

  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const [imgsLoaded, setImgsLoaded] = useState([])
  const [imgsLoadPromises, setImgsLoadPromises] = useState([])
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
            className='img-item'
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
      dataUrlsLen = dataUrls.length
    if (dataUrlsLen && imgsLen === dataUrlsLen && imgsLoadPromises) {
      const dimensions = calculateDimensions(images)
      setMaxWidth(dimensions.width.max)
      setDimensions(dimensions)
    }
  }, [imgsRefs, dataUrls, imgsLoadPromises])

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
        {images}
      </div>
    </Fragment>
  )
}

export default ImageList
