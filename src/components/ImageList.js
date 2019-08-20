import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import DataContext from '../context/DataContext'
import { calculateDimensions } from '../utils/'
import Resize from '../common/ResizeForm'

const ImageList = ({ dataUrls }) => {
  const data = useContext(DataContext)
  const [clickStatus, setClickStatus] = useState(false)
  const [images, setImages] = useState([])
  const [maxWidth, setMaxWidth] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const [imgsLoadStatus, setImgsLoadStatus] = useState([])
  const [imgsLoadPromises, setImgsLoadPromises] = useState([])
  const imgsDivRef = useCallback(node => {
    if (node !== null) {
      data.setContextState({
        imgsDivRef: node
      })
    }
    //adding dataContext as a dependency will cause maximum call stack error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // const canvasDivRef = useCallback(node => {
  //   if (node !== null) {
  //     data.setContextState({
  //       canvasDivRef: node
  //     })
  //   }
  //   //adding data as a dependency will cause maximum call stack error.
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const createCanvas = (img, i) => {
  //   const canvas = (
  //     <canvas
  //       key={i}
  //       width={img.width}
  //       height={img.height}
  //       className='canvas-item'
  //       ref={el => {
  //         canvasRefs.current[i] = el
  //       }}
  //     />
  //   )
  //   return canvas
  // }

  // const drawCanvas = (img, i) => {
  //   const canvas = canvasRefs.current[i]
  //   const ctx = canvas.getContext('2d')
  //   ctx.drawImage(img, 0, 0)
  // }

  // useEffect(() => {
  //   canvasRefs.current = canvasRefs.current.slice(0, imgCount)
  // }, [imgCount])

  useEffect(() => {
    if (!imgsLoadStatus) return
    const dimensions = calculateDimensions(images)
    setMaxWidth(dimensions.w.max)
    setDimensions(dimensions)
  }, [imgsLoadStatus, images])

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
    //adding data as a dependency will cause maximum call stack error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgsLoadPromises, dataUrls])

  return (
    <Fragment>
      <div className='image-wrapper' ref={imgsDivRef} style={{ maxWidth }}>
        {dataUrls.map((img, i) => {
          const image = (
            <img
              src={img}
              alt={i.toString()}
              key={i}
              className='img-item'
              onLoad={() => {
                const imgsLoadPromisesCopy = imgsLoadPromises.slice()
                imgsLoadPromisesCopy[i] = new Promise((resolve, reject) => {
                  resolve(true)
                })
                setImgsLoadPromises(imgsLoadPromisesCopy)
              }}
            />
          )
          const imagesCopy = images.slice()
          imagesCopy[i] = image
          if (!images[i]) setImages(imagesCopy)
          return image
        })}
      </div>
    </Fragment>
  )
}

export default ImageList
