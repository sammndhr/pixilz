import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
import { calculateDimensions, useWindowSize } from '../utils/'
import { Grid } from '@material-ui/core/'

const ImageList = ({ gridSpace }) => {
  const size = useWindowSize()
  const { state, dispatch } = useContext(DataContext)
  const { dataUrls } = state
  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(document.body.clientWidth)
  const [dimensions, setDimensions] = useState({})
  const [imgsLoaded, setImgsLoaded] = useState(false)
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
    console.log(size)
  }, [size])

  useEffect(() => {
    // Can't use images from state because they are React objects
    const images = imgsRefs.current,
      padding = 2 * (4 * gridSpace)

    if (imgsLoaded) {
      const dimensions = calculateDimensions(images, true)
      setMaxWidth(dimensions.width.max + padding) //multiply by 4 cause Material UI does it that way
      setDimensions(dimensions)
    }
  }, [imgsRefs, imgsLoaded, gridSpace])

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
    <Grid item md={8} sm={12} style={{ maxWidth }}>
      <div className='images-wrapper' ref={imgsWrapperRef}>
        {images}
      </div>
    </Grid>
  )
}

export default ImageList
