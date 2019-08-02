import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
import DataContext from '../context/DataContext'

const Resize = () => {
  const dimensions = useContext(DataContext).dimensions
  const [value, setValue] = useState(100)
  const [{ min, max }, setMinMax] = useState({ min: 100, max: 720 })
  const [position, setPosition] = useState(value - min)
  const handleFocus = value => {
    setValue(value)
    const position = `${((value - 100) / (max - min)) * 578}px`
    console.log(position)
    setPosition(position)
  }
  const calculatePosition = value => {
    const position = `${((value - min) / (max - min)) * 578}px`
    return position
  }
  const handleChange = function(event) {
    const value = event.target.value
    setValue(value)
    const position = calculatePosition(value)
    setPosition(position)
  }
  useEffect(() => {
    if (position < 100) {
    }
    setValue(value)
    console.log(dimensions)
    if (!dimensions.minMaxWidth) return
    const minMaxWidth = dimensions.minMaxWidth
    const min = minMaxWidth.min
    const max = minMaxWidth.max
    setMinMax({ min, max })
  }, [value, dimensions, position])
  const handleKeyPress = event => {
    if (
      (event.target.value > max || event.target.value < min) &&
      event.keyCode !== 46 &&
      event.keyCode !== 8
    ) {
      event.preventDefault()
      setValue(min)
      setPosition(calculatePosition(min))
    }
  }
  return (
    <div className='container' style={{ backgroundColor: 'black' }}>
      <input
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyPress}
        type='number'
        onChange={handleChange} //write new onChange
        value={value} //create new state
        min={min}
        max={max}
      />
      <div className='range-slider'>
        <span id='rs-bullet' className='rs-label' style={{ left: position }}>
          {value}
        </span>
        <input
          id='rs-range-line'
          className='rs-range'
          type='range'
          min={min}
          value={value}
          max={max}
          onChange={handleChange}
        />
      </div>

      <div className='box-minmax'>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
export default Resize
