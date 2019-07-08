import React, { Component, Fragment } from 'react'
import DataContext from '../context/DataContext'

const Image = props => {
  return (
    <img
      src={props.src}
      className='images'
      alt={props.alt}
      onLoad={props.onLoad}
      onError={props.onError}
    />
  )
}

export default class ImageList extends Component {
  static contextType = DataContext

  state = {
    imgsLoadPromises: [],
    allLoadStatus: false
  }

  componentDidUpdate(prevProps, prevState) {
    const dataContext = this.context
    const urlsCount = prevProps.dataUrls.length
    const promises = this.state.imgsLoadPromises
    const promisesCount = promises.length

    if (
      prevState.imgsLoadPromises.length !== promisesCount &&
      promisesCount === urlsCount
    ) {
      Promise.all(promises).then(() => {
        this.setState(prevState => ({
          allLoadStatus: !prevState.allLoadStatus
        }))
        dataContext.setImgsLoadStatus({
          loadStatus: this.state.allLoadStatus
        })
      })
    }
  }

  handleLoadedImg = e => {
    const loaded = Promise.resolve(true)
    this.setState(prevState => {
      const updatedStatus = prevState.imgsLoadPromises.slice()
      updatedStatus.push(loaded)
      return { imgsLoadPromises: updatedStatus }
    })
  }

  handleLoadError = e => {
    //todo
    console.log()
  }

  render() {
    return [
      this.props.dataUrls.map((src, i) => (
        <img
          key={i}
          src={src}
          className='images'
          onLoad={this.handleLoadedImg}
          onError={this.handleLoadError}
          alt='alt'
        />
      ))
    ]
  }
}
