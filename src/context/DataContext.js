import React, { createContext, useReducer } from 'react'

const DataContext = createContext()
const DataConsumer = DataContext.Consumer

const DataProvider = ({ children }) => {
  const initialState = {
    dataUrls: [],
    imgsUploaded: false,
    imgsWrapperRef: null,
    imgsLoaded: false,
    dimensions: {
      width: { min: 0, max: 0, avg: 0 },
      height: { min: 0, max: 0, avg: 0 }
    },
    canvasesLoaded: false,
    canvasesWrapperRef: null,
    canvasProcessStatus: false,
    loader: false,
    resizePrefs: {
      scaleDown: false,
      scaleUp: true
    },
    sort: true
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'RESET':
        return initialState
      case 'SET_DATA_URLS':
        return { ...state, dataUrls: action.payload }
      case 'UPDATE_UPLOAD_STATUS':
        return { ...state, imgsUploaded: action.payload }
      case 'SET_IMGS_WRAPPER_REF':
        return { ...state, imgsWrapperRef: action.payload }
      case 'UPDATE_IMGS_LOAD_STATUS':
        return { ...state, imgsLoaded: action.payload }
      case 'UPDATE_DIMENSIONS':
        return { ...state, dimensions: action.payload }
      case 'UPDATE_CANVASES_LOADED':
        return { ...state, canvasesLoaded: action.payload }
      case 'UPDATE_CANVASES_WRAPPER_REF':
        return { ...state, canvasesWrapperRef: action.payload }
      case 'UPDATE_CANVAS_PROCESS_STATUS':
        return { ...state, canvasProcessStatus: action.payload }
      case 'SHOW_LOADER':
        return { ...state, loader: action.payload }
      case 'UPDATE_RESIZE_PREFS':
        return { ...state, resizePrefs: action.payload }
      case 'UPDATE_SORT':
        return { ...state, sort: action.payload }
      default:
        return { ...state }
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataContext
export { DataProvider, DataConsumer }
