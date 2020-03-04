import React, { Fragment, useEffect, useState } from 'react'

const Resize = ({ handleStitchPrefsChange }) => {
  const [stitchPrefs, setStitchPrefs] = useState({
    stitchOnly: false,
    stitchAndSlice: true
  })

  const [selectedVal, setselectedVal] = useState(
    stitchPrefs.stitchOnly ? 'stitchOnly' : 'stitchAndSlice'
  )

  const handleChange = event => {
    setselectedVal(event.target.value)
  }

  useEffect(() => {
    const localstitchPrefs = {
      stitchOnly: false,
      stitchAndSlice: true
    }
    if (selectedVal === 'stitchAndSlice') {
      localstitchPrefs.stitchAndSlice = true
      localstitchPrefs.stitchOnly = false
    } else if (selectedVal === 'stitchOnly') {
      localstitchPrefs.stitchOnly = true
      localstitchPrefs.stitchAndSlice = false
    }
    if (stitchPrefs.stitchOnly !== localstitchPrefs.stitchOnly) {
      setStitchPrefs(localstitchPrefs)
      handleStitchPrefsChange(localstitchPrefs)
    }
  }, [selectedVal, stitchPrefs, handleStitchPrefsChange])

  return (
    <div className='form options'>
      <fieldset className='form-group'>
        <Fragment>
          <label className='form-radio-label' htmlFor='stitchAndSlice'>
            <input
              className='input'
              type='radio'
              name='stitch'
              value='stitchAndSlice'
              id='stitchAndSlice'
              checked={selectedVal === 'stitchAndSlice'}
              onChange={handleChange}
            />
            <span className='radio-span'></span>
            <span> Stitch and Slice </span>
          </label>
          <label className='form-radio-label' htmlFor='stitchOnly'>
            <input
              className='input'
              type='radio'
              name='stitch'
              value='stitchOnly'
              id='stitchOnly'
              checked={selectedVal === 'stitchOnly'}
              onChange={handleChange}
            />
            <span className='radio-span'></span>
            <span> Stitch Only </span>
          </label>
        </Fragment>
      </fieldset>
    </div>
  )
}
export default Resize
