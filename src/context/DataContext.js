import React, { Component } from 'react'

export const defaultState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  canvasLoadStatus: false,
  canvasDivRef: null,
  canvasProcessStatus: false,
  checked: true,
  dimensions: {
    w: { min: 0, max: 0, avg: 0 },
    h: { min: 0, max: 0, avg: 0 }
  },
  setContextState: () => {}
}

const DataContext = React.createContext(defaultState)

class DataProvider extends Component {
  state = {
    dataUrls: [],
    uploadStatus: false,
    imgsLoadStatus: false,
    canvasLoadStatus: false,
    canvasProcessStatus: false,
    canvasDivRef: null,
    dimensions: {},
    checked: true
  }

  setContextState = args => {
    this.setState(args)
  }

  render() {
    const { children } = this.props

    return (
      <DataContext.Provider
        value={{
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
