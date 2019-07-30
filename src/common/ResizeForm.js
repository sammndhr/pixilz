import React, { Fragment, useState, useContext, useEffect } from 'react'
import DataContext from '../context/DataContext'

const Resize = () => {
  const data = useContext(DataContext)
  const [value, setValue] = useState(4)
  const handleChange = function(event) {
    setValue({ value: event.target.value })
  }
  useEffect(() => {
    setValue(value)
    console.log(data)
  }, [value, data])
  return (
    <input
      id='typeinp'
      type='range'
      min='0'
      max='15'
      defaultValue={value}
      onChange={handleChange}
      step='1'
    />
  )
}
export default Resize
