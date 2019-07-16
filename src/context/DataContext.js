import React, { Component } from 'react'

export const defaultState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  canvasLoadStatus: false,
  canvasDivRef: null,
  avgHeight: 0,
  setData: () => {},
  setImgsLoadStatus: () => {},
  setCanvasLoadStatus: () => {}
}

const DataContext = React.createContext(defaultState)

class DataProvider extends Component {
  state = {
    dataUrls: [],
    uploadStatus: false,
    imgsLoadStatus: false,
    canvasLoadStatus: false,
    canvasDivRef: null,
    avgHeight: 0
  }

  setData = ({ dataUrls, uploadStatus }) => {
    this.setState({ dataUrls })
    this.setState({ uploadStatus })
  }

  setImgsLoadStatus = ({ imgsLoadStatus }) => {
    this.setState({ imgsLoadStatus })
  }

  setCanvasLoadStatus = ({ canvasLoadStatus }) => {
    this.setState({ canvasLoadStatus })
  }

  setContextState = args => {
    this.setState(args)
  }

  render() {
    const { children } = this.props

    return (
      <DataContext.Provider
        value={{
          setData: this.setData,
          setImgsLoadStatus: this.setImgsLoadStatus,
          setCanvasLoadStatus: this.setCanvasLoadStatus,
          setContextState: this.setContextState,
          ...this.state
        }}>
        {children}
      </DataContext.Provider>
    )
  }
}

export default DataContext
export { DataProvider }
