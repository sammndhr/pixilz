import React from 'react'

export const dataState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  canvasLoadStatus: false,
  setData: () => {},
  setImgsLoadStatus: () => {},
  setCanvasLoadStatus: () => {}
}

const DataContext = React.createContext(dataState)

export default DataContext
