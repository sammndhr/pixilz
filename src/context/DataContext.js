import React, { Component } from 'react'

export const defaultState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  canvasLoadStatus: false,
  canvasDivRef: null,
  avgHeight: 0,
  avgWidth: 0,
  canvasProcessStatus: false,
  checked: true,
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
    avgHeight: 0,
    avgWidth: 0,
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
