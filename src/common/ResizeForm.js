import React, { Fragment, useState, useContext, useEffect } from 'react'
import DataContext from '../context/DataContext'

const Resize = () => {
  const data = useContext(DataContext)
  const [value, setValue] = useState(4)
  const max = 200
  const [position, setPosition] = useState(value)
  // const showSliderValue = e => {
  //   console.log(e.target)
  //   console.log(rangeSlider.value)
  //   rangeBullet.value = rangeSlider.value
  //   var bulletPosition = rangeSlider.value / rangeSlider.max
  //   rangeBullet.style.left = bulletPosition * 578 + 'px'
  // }
  const handleChange = function(event) {
    const value = event.target.value

    console.log(value)
    setValue(value)
    const position = `${(value / max) * 578}px`
    setPosition(position)
  }
  useEffect(() => {
    console.log(value)
    setValue(value)
    console.log(data)
  }, [value, data])
  // var rangeSlider = document.getElementById('rs-range-line')
  // var rangeBullet = document.getElementById('rs-bullet')

  return (
    <div className='container'>
      <div className='range-slider'>
        <span id='rs-bullet' className='rs-label' style={{ left: position }}>
          {value}
        </span>
        <input
          id='rs-range-line'
          className='rs-range'
          type='range'
          min='0'
          defaultValue={value}
          max={max}
          onChange={handleChange}
        />
      </div>

      <div className='box-minmax'>
        <span>0</span>
        <span>200</span>
      </div>
    </div>
  )
}
export default Resize

/* <input
      id='typeinp'
      type='range'
      min='0'
      max='15'
      defaultValue={value}
      onChange={handleChange}
      step='1'
    /> */
