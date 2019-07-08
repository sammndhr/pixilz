import React from 'react'

export const dataState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  setData: () => {},
  setImgsLoadStatus: () => {}
}

const DataContext = React.createContext(dataState)

export default DataContext
