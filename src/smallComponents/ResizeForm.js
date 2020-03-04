import React, { Fragment, useContext, useEffect, useState } from 'react'
import DataContext from '../context/DataContext'

const Resize = ({ handleSizeChange }) => {
  const { state } = useContext(DataContext)
  const { dimensions } = state
  const [disabled, setDisabled] = useState(false)

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
    const cleanup = () => {
      if (!!width.min) {
        setWidth({
          min: 0,
          max: 0,
          avg: 0
        })
      }
    }
    return cleanup
  }, [dimensions, width.min])

  const handleChange = event => {
    handleSizeChange(event.target.value)
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
      handleSizeChange(localResizePrefs)
    }
  }, [selectedVal, resizePrefs, handleSizeChange])

  return (
    <Fragment>
      {!disabled ? (
        <div className='form options'>
          <fieldset className='form-group'>
            <label className='form-radio-label' htmlFor='smallest'>
              <input
                disabled={disabled}
                className='input'
                type='radio'
                name='resize'
                value='scaleDown'
                id='smallest'
                checked={selectedVal === 'scaleDown' && !disabled}
                onChange={handleChange}
              />
              <span className='radio-span'></span>
              <span>Resize to smallest: {width.min}px</span>
            </label>
            <label className='form-radio-label' htmlFor='largest'>
              <input
                disabled={disabled}
                className='input'
                type='radio'
                name='resize'
                value='scaleUp'
                id='largest'
                checked={selectedVal === 'scaleUp' && !disabled}
                onChange={handleChange}
              />
              <span className='radio-span'></span>
              <span>Resize to largest: {width.max}px</span>
            </label>
          </fieldset>
        </div>
      ) : null}
    </Fragment>
  )
}
export default Resize
