import React, { Component } from 'react'
import DataContext from '../context/DataContext'

class ImageList extends Component {
  static contextType = DataContext

  state = {
    imgsLoadPromises: [],
    allLoadStatus: false
  }

  componentDidUpdate(prevProps, prevState) {
    const dataContext = this.context
    const promises = this.state.imgsLoadPromises
    const promisesCount = promises.length
    const prevPromisesCount = prevState.imgsLoadPromises.length

    if (promisesCount !== prevPromisesCount) {
      Promise.all(promises)
        .then(() => {
          this.setState(prevState => ({
            allLoadStatus: !prevState.allLoadStatus
          }))
          dataContext.setImgsLoadStatus({
            imgsLoadStatus: this.state.allLoadStatus
          })
        })
        .catch(err => {
          console.error('Error loading images: ', err)
        })
    }
  }

  handleLoadedImg = () => {
    const loaded = Promise.resolve(true)
    this.setState(prevState => {
      const updatedStatus = prevState.imgsLoadPromises.concat(loaded)
      return { imgsLoadPromises: updatedStatus }
    })
  }

  handleLoadError = () => {
    //todo
    console.error('Error laoding image')
  }

  render() {
    const { imageRef, ...rest } = this.props
    return (
      <div ref={imageRef} className='images-wrapper'>
        {/* div will get forwarded in Canvas as this.props.forwardedRef*/}
        {rest.dataUrls.map((src, i) => (
          <img
            key={i}
            src={src}
            className='images'
            onLoad={this.handleLoadedImg}
            onError={this.handleLoadError}
            alt='alt'
          />
        ))}
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <ImageList {...props} imageRef={ref} />
))
