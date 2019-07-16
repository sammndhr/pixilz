import React, { Fragment, PureComponent } from 'react'
import CanvasList from './CanvasList'
import Canvas from './Canvas'
import DataContext from '../context/DataContext'
import { Route } from 'react-router-dom'

export default class CanvasControl extends PureComponent {
  static contextType = DataContext
  state = {
    clickStatus: false
  }
  renderCanvas = () => {
    return <CanvasList />
  }

  renderProcessedCanvas = clickStatus => {
    if (clickStatus) {
      return <Canvas />
    }
  }
  handleClick = history => {
    this.setState(prevState => ({ clickStatus: !prevState.clickStatus }))
  }
  renderButton = history => {
    return (
      <button
        onClick={e => {
          this.handleClick(history)
        }}>
        Stitch n Slice
      </button>
    )
  }

  render() {
    return (
      <Fragment>
        {this.renderButton('history')}
        {this.renderProcessedCanvas(this.state.clickStatus)}
        {this.renderCanvas()}
      </Fragment>
    )
  }
}
