import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'

const Resize = () => {
  const data = useContext(DataContext)
  const [errors, setErrors] = useState({
    width: false,
    height: false
  })
  const [w, setWidth] = useState({
    min: 0,
    max: 0,
    avg: 0
  })

  const [h, setHeight] = useState({
    min: 0,
    max: 0,
    avg: 0
  })
  useEffect(() => {
    if (data.dimensions.w && data.dimensions.h) {
      // console.log(data.dimensions.dimensions)
      console.log(data.dimensions.w, data.dimensions.h)
      setWidth(data.dimensions.w)
      setHeight(data.dimensions.h)
    }

    // if (data.dimensions.h) {
    // }
  }, [data])
  useEffect(() => {
    console.log(w.min, h.min)
    console.log(w.max, h.max)
  }, [w, h])

  const validate = ({ width = 0, height = 0 }) => {
    console.log(width <= 1080 && width >= 100, width)
    console.log(height <= 3000 && height >= 100, 'height', height)
    return {
      width: width <= 1080 && width >= 100,
      height: height <= 3000 && height >= 100
    }
  }
  const handleChange = event => {
    console.log(event)
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
  }, [errors])
  //     setWidth(dimensions.avgWidth)
  //     setwidth({
  //       avgWidth: dimensions.avgWidth,
  //       min: minMaxWidth.min,
  //       max: minMaxWidth.max
  //     })
  //   }
  //   if (dimensions.avgHeight) {
  //     console.log(errors)
  //     const minMax = dimensions.minMax
  //     setHeight(dimensions.avgHeight)
  //     setHeight({
  //       avgHeight: dimensions.avgHeight,
  //       min: minMax.min,
  //       max: minMax.max
  //     })
  //   }
  // }, [])

  return (
    <div className='options'>
      <fieldset>
        <legend>Options</legend>
        <label className='form-check-label' htmlFor='smallest'>
          <input
            className='input'
            type='radio'
            name='resize'
            id='smallest'
            checked={data.scaleDown}
            onChange={handleChange}
          />
          <span>Resize to smallest image {w.min}px</span>
        </label>
        <label className='form-check-label' htmlFor='largest'>
          <input
            className='input'
            type='radio'
            name='resize'
            id='largest'
            checked={data.scaleUp}
            onChange={handleChange}
          />
          <span>Resize to largest image {w.max}px</span>
        </label>

        <label className='form-check-label' htmlFor='width'>
          <div>Exact Width</div>
          <span>{w.min}&gt;</span>
          <input
            className={errors.width ? 'error input' : 'input'}
            min={w.min}
            max={w.max}
            type='number'
            onChange={handleWidthChange}
            value={w.width}
            name='width'
          />
          <span>&lt;{1080}</span>
        </label>
        <label className='form-check-label' htmlFor='height'>
          <div> Average Height</div>
          <span>{h.min}&gt;</span>
          <input
            className={errors.height ? 'error input' : 'input'}
            min={h.min}
            max={h.max}
            type='number'
            onChange={handleHeightChange}
            value={h.height}
            name='height'
          />
          <span>&lt;{h.max}</span>
        </label>
      </fieldset>
    </div>
  )
}
export default Resize
