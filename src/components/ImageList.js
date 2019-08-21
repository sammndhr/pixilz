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

const ImageList = ({ dataUrls }) => {
  const data = useContext(DataContext)
  // const [clickStatus, setClickStatus] = useState(false)
  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const [imgsLoadStatus, setImgsLoadStatus] = useState([])
  const [imgsLoadPromises, setImgsLoadPromises] = useState([])
  const imgsRefs = useRef([])

  const imgsDivRef = useCallback(node => {
    if (node !== null) {
      data.setContextState({
        imgsDivRef: node
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
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
      setImgsLoadStatus(true)
    }
  }, [dataUrls, imgsLoadPromises])

  useEffect(() => {
    // Can't use images from state because they are React objects
    const images = imgsRefs.current,
      imgsLen = images.length,
      dataUrlsLen = dataUrls.length
    if (dataUrlsLen && imgsLen === dataUrlsLen && imgsLoadPromises) {
      const dimensions = calculateDimensions(images)
      setMaxWidth(dimensions.w.max)
      setDimensions(dimensions)
    }
  }, [imgsRefs, dataUrls, imgsLoadPromises])

  useEffect(() => {
    if (!imgsLoadStatus) return
    const newContextState = {
      dimensions,
      imgsLoadStatus
    }
    data.setContextState(newContextState)
    const cleanup = () => {
      data.setContextState({
        imgsLoadStatus: false
      })
    }
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, maxWidth])

  useEffect(() => {
    if (dataUrls.length && dataUrls.length === imgsLoadPromises.length) {
      Promise.all(imgsLoadPromises).then(() => {
        setImgsLoadStatus(true)
        data.setContextState({
          imgsLoadStatus: true
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgsLoadPromises, dataUrls])

  return (
    <Fragment>
      <div className='image-wrapper' ref={imgsDivRef} style={{ maxWidth }}>
        {images}
      </div>
    </Fragment>
  )
}

export default ImageList
