import React, { Component, Fragment } from 'react'
import ImageList from './ImageList.js'
import UploadImages from './UploadImages'
import Canvas from './Canvas'
import DataContext from '../context/DataContext'

export default class Main extends Component {
  static contextType = DataContext

  state = {
    dataUrls: [],
    uploadStatus: false,
    loadStatus: false,
    setData: ({ dataUrls, uploadStatus }) => {
      this.setState({ dataUrls })
      this.setState({ uploadStatus })
    },
    setImgsLoadStatus: ({ loadStatus }) => {
      this.setState({ loadStatus })
    }
  }

  renderImgList = () => {
    return (
      <div>
        <div>
          {/* <Link
            to={{
              pathname: '/canvas',
              state: {
                images: this.state.images
              }
            }}>
            Stitch
          </Link> */}
        </div>
        <Canvas>
          <ImageList dataUrls={this.state.dataUrls} />
        </Canvas>
      </div>
    )
  }

  renderUploadButton = () => {
    return <UploadImages />
  }

  render() {
    return (
      <DataContext.Provider value={this.state}>
        <Fragment>
          <main>
            {this.state.uploadStatus
              ? this.renderImgList()
              : this.renderUploadButton()}
          </main>
        </Fragment>
      </DataContext.Provider>
    )
  }
}
