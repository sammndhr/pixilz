import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import DataContext from '../context/DataContext'
import { calculateDimensions } from '../utils/'
import { Grid, useMediaQuery } from '@material-ui/core/'

const ImageList = ({ gridSpace }) => {
  const matches = useMediaQuery('(max-width:640px)')
  const { state, dispatch } = useContext(DataContext)
  const { dataUrls } = state
  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(document.body.clientWidth)
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
      dataUrlsLen = dataUrls.length,
      padding = 2 * (4 * gridSpace)
    if (
      dataUrlsLen &&
      imgsLen === dataUrlsLen &&
      imgsLoadPromises &&
      !matches
    ) {
      const dimensions = calculateDimensions(images, true)
      setMaxWidth(dimensions.width.max + padding) //multiply by 4 cause Material UI does it that way
      setDimensions(dimensions)
    }
    if (matches && imgsLoadPromises) {
      const newWidth = document.body.clientWidth - padding
      const len = images.length
      for (let i = 0; i < len; i++) {
        const img = images[i]
        img.setAttribute('width', newWidth)
      }
    }
  }, [imgsRefs, dataUrls, imgsLoadPromises, matches, gridSpace])

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
