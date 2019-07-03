import React, { Component, Fragment } from 'react'

export default class Main extends Component {
  state = { imgUrls: [], uploadStatus: false }
  sortFilesByName = files => {
    const filesArr = Array.from(files)
    const reA = /[^a-zA-Z]/g
    const reN = /[^0-9]/g

    function sortAlphaNum(objA, objB) {
      const a = objA.name
      const b = objB.name
      const aA = a.replace(reA, '')
      const bA = b.replace(reA, '')
      if (aA === bA) {
        const aN = parseInt(a.replace(reN, ''), 10)
        const bN = parseInt(b.replace(reN, ''), 10)
        return aN === bN ? 0 : aN > bN ? 1 : -1
      } else {
        return aA > bA ? 1 : -1
      }
    }
    return filesArr.sort(sortAlphaNum)
  }

  readFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = evt => {
        resolve(evt.target.result)
      }
      reader.onerror = err => {
        console.error('Failed to read', file.name, 'due to', err)
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  }
  readMultipleFiles = async files => {
    const sortedFiles = this.sortFilesByName(files)
    const promises = sortedFiles.map(async file => {
      const data = await this.readFile(file)
      return data
    })

    return Promise.all(promises).then(results => {
      return results
    })
  }

  uploadFiles = e => {
    this.readMultipleFiles(e.target.files)
      .then(results => {
        this.setState({ imgUrls: results })
        this.setState(prevState => ({
          uploadStatus: !prevState.uploadStatus
        }))
        this.props.onDataUrls(results)
        this.props.onStatusChange(this.state.uploadStatus)
      })
      .catch(err => {
        console.error('Well that sucks:', err)
      })
  }

  render() {
    return (
      <Fragment>
        <label htmlFor='upload-images'>Upload Images</label>
        <input
          id='upload-images'
          type='file'
          multiple='multiple'
          onChange={this.uploadFiles}
        />
      </Fragment>
    )
  }
}
