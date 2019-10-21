import React, { useState, useEffect, Fragment, useContext, useRef, useLayoutEffect } from 'react'
import DataContext from '../context/DataContext'

const DownloadForm = ({ canvasesDrawn }) => {
  const inputRef = useRef(null)
  const defaultValue = 'Pixilz'
  const [value, setValue] = useState(defaultValue)
  const [color, setColor] = useState('inherit')

  const { dispatch } = useContext(DataContext)
  const handleChange = event => {
    setValue(event.target.value)
  }
  const handleFocus = () => {
    setColor('#3682ed')
  }
  //focus() does NOT work without setTimeout
  useLayoutEffect(() => {
    if (canvasesDrawn) {
      setTimeout(() => {
        inputRef.current.focus()
        inputRef.current.select()
      }, 400)
    }
  }, [canvasesDrawn])

  useEffect(() => {
    dispatch({ type: 'UPDATE_FOLDER_NAME', payload: value })
  }, [dispatch, value])

  const handleBlur = () => {
    setColor('inherit')
  }

  return (
    <div className='form options'>
      <fieldset className='form-group'>
        <Fragment>
          <label className='form-text-label' htmlFor='folder-name'>
            <span style={{ display: 'block', color }} className='form-text-helper'>
              Zip File name
            </span>
            <div className='input-text-wrapper'>
              <input
                className='input-text'
                ref={inputRef}
                onChange={handleChange}
                type='text'
                id='folder-name'
                name='fname'
                onFocus={handleFocus}
                onBlur={handleBlur}
                defaultValue={defaultValue}
              />
              <span className='focus-border'></span>
            </div>
          </label>
        </Fragment>
      </fieldset>
    </div>
  )
}
export default DownloadForm
