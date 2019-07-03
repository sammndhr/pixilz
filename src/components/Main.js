import React, { Component, Fragment } from 'react'
import ImageList from './ImageList.js'
import UploadImages from './UploadImages'

export default class Main extends Component {
  state = { imgUrls: [], uploadStatus: false }
  handleDataUrls = dataUrls => {
    this.setState({ imgUrls: dataUrls })
  }
  handleStatus = status => {
    this.setState({ uploadStatus: status })
  }
  handleLoad = () => {
    console.log('loaded')
  }

  renderImgList = () => {
    return (
      <ImageList imgUrls={this.state.imgUrls} handleLoad={this.handleLoad} />
    )
  }

  renderUploadButton = () => {
    return (
      <UploadImages
        onDataUrls={this.handleDataUrls}
        onStatusChange={this.handleStatus}
      />
    )
  }

  render() {
    return (
      <Fragment>
        <main>
          {this.state.uploadStatus
            ? this.renderImgList()
            : this.renderUploadButton()}
        </main>
      </Fragment>
    )
  }
}
