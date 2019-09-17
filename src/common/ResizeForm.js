import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'

const Resize = ({ handleRadioButtonChange }) => {
  const { state } = useContext(DataContext)
  const { dimensions } = state
  const [disabled, setDisabled] = useState(false)

  // const [errors, setErrors] = useState({
  // width: false
  // })
  const [resizePrefs, setResizePrefs] = useState({
    scaleDown: true,
    scaleUp: false
  })
  const [width, setWidth] = useState({
    min: 0,
    max: 0,
    avg: 0
  })
  const [selectedVal, setselectedVal] = useState(
    resizePrefs.scaleDown ? 'scaleDown' : 'scaleUp'
  )
  useEffect(() => {
    if (dimensions.width && dimensions.height && !width.min) {
      if (dimensions.width.min === dimensions.width.max) {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
      setWidth(dimensions.width)
    }
  }, [dimensions, width.min])
  // const validate = ({ width = 0, height = 0 }) => {
  //   return {
  //     width: width <= 1080 && width >= 100,
  //     height: height <= 3000 && height >= 100
  //   }
  // }
  const handleChange = event => {
    handleRadioButtonChange(event.target.value)
    setselectedVal(event.target.value)
  }

  useEffect(() => {
    const localResizePrefs = { scaleDown: false, scaleUp: false }
    if (selectedVal === 'scaleUp') {
      localResizePrefs.scaleUp = true
      localResizePrefs.scaleDown = false
    } else if (selectedVal === 'scaleDown') {
      localResizePrefs.scaleDown = true
      localResizePrefs.scaleUp = false
    }
    if (resizePrefs.scaleDown !== localResizePrefs.scaleDown) {
      setResizePrefs(localResizePrefs)
      handleRadioButtonChange(localResizePrefs)
    }
  }, [selectedVal, resizePrefs, handleRadioButtonChange])

  // const handleWidthChange = event => {
  //   const error = !validate({ width: event.target.value }).width
  //   if (error) {
  //     setErrors({
  //       ...errors,
  //       width: error
  //     })
  //   } else {
  //     setErrors({
  //       ...errors,
  //       width: false
  //     })
  //   }
  //   setWidth({
  //     ...w,
  //     width: event.target.value
  //   })
  // }

  return (
    <div className='options'>
      <fieldset disabled={disabled}>
        <legend>Options</legend>
        <label className='form-check-label' htmlFor='smallest'>
          <input
            className='input'
            type='radio'
            name='resize'
            value='scaleDown'
            id='smallest'
            checked={selectedVal === 'scaleDown'}
            onChange={handleChange}
          />
          <span>Resize to smallest image {width.min}px</span>
        </label>
        <label className='form-check-label' htmlFor='largest'>
          <input
            className='input'
            type='radio'
            name='resize'
            value='scaleUp'
            id='largest'
            checked={selectedVal === 'scaleUp'}
            onChange={handleChange}
          />
          <span>Resize to largest image {width.max}px</span>
        </label>
        {/* 
        <label className='form-check-label' htmlFor='width'>
          <div>Exact Width</div>
          <span>{w.min}px &gt; </span>
          <input
            className={errors.width ? 'error input' : 'input'}
            min={w.min}
            max={w.max}
            type='number'
            onChange={handleWidthChange}
            value={w.width}
            name='width'
          />
          <span> &lt; {w.max}px</span>
        </label> */}
      </fieldset>
    </div>
  )
}
export default Resize
