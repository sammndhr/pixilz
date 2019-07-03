import React, { Component, Fragment } from 'react'

const Image = props => {
  return (
    <img
      src={props.src}
      className='images'
      alt={props.alt}
      onLoad={props.handleLoad}
    />
  )
}

export default class ImageList extends Component {
  render() {
    return (
      <Fragment>
        {this.props.imgUrls.map((src, i) => {
          return <Image src={src} key={i} handleLoad={this.props.handleLoad} />
        })}
      </Fragment>
    )
  }
}
