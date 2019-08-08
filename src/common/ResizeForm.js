import React, { Fragment, useState, useContext, useEffect } from 'react'
import DataContext from '../context/DataContext'

const Resize = () => {
  const dimensions = useContext(DataContext).dimensions
  const [errors, setErrors] = useState({
    width: false,
    height: false
  })
  const [w, setWidth] = useState({
    width: 720,
    avgWidth: 720,
    minWidth: 100,
    maxWidth: 1080
  })

  const [h, setHeight] = useState({
    height: 720,
    avgHeight: 720,
    minHeight: 100,
    maxHeight: 5000
  })

  const validate = ({ width = 0, height = 0 }) => {
    console.log(width <= 1080 && width >= 100, width)
    console.log(height <= 3000 && height >= 100, 'height', height)
    return {
      width: width <= 1080 && width >= 100,
      height: height <= 3000 && height >= 100
    }
  }

  const handleWidthChange = event => {
    const error = !validate({ width: event.target.value }).width
    if (error) {
      setErrors({
        ...errors,
        width: error
      })
    } else {
      setErrors({
        ...errors,
        width: false
      })
    }
    setWidth({
      ...w,
      width: event.target.value
    })
  }
  const handleHeightChange = event => {
    const error = !validate({ height: event.target.value }).height
    if (error) {
      setErrors({
        ...errors,
        height: error
      })
    } else {
      setErrors({
        ...errors,
        height: false
      })
    }
    setHeight({
      ...h,
      height: event.target.value
    })
  }
  useEffect(() => {
    // if (dimensions.avgWidth) {
    //   const minMaxWidth = dimensions.minMaxWidth
    // }
    console.log(errors)
  }, [errors])
  //     setWidth(dimensions.avgWidth)
  //     setwidth({
  //       avgWidth: dimensions.avgWidth,
  //       minWidth: minMaxWidth.min,
  //       maxWidth: minMaxWidth.max
  //     })
  //   }
  //   if (dimensions.avgHeight) {
  //     console.log(errors)
  //     const minMaxHeight = dimensions.minMaxHeight
  //     setHeight(dimensions.avgHeight)
  //     setHeight({
  //       avgHeight: dimensions.avgHeight,
  //       minHeight: minMaxHeight.min,
  //       maxHeight: minMaxHeight.max
  //     })
  //   }
  // }, [])

  return (
    <div className='options'>
      <fieldset>
        <legend>Options</legend>
        <label className='form-check-label' htmlFor='width'>
          <div>Current Average Width</div>
          <div>Exact Width</div>
          <span>{w.minWidth}&gt;</span>
          <input
            className={errors.width ? 'error input' : 'input'}
            min={w.minWidth}
            max={w.maxWidth}
            type='number'
            onChange={handleWidthChange}
            value={w.width}
            name='width'
          />
          <span>&lt;{1080}</span>
        </label>
        <label className='form-check-label' htmlFor='height'>
          <div> Average Height</div>
          <span>{h.minHeight}&gt;</span>
          <input
            className={errors.height ? 'error input' : 'input'}
            min={h.minHeight}
            max={h.maxHeight}
            type='number'
            onChange={handleHeightChange}
            value={h.height}
            name='height'
          />
          <span>&lt;{h.maxHeight}</span>
        </label>
      </fieldset>
    </div>
  )
}
export default Resize
