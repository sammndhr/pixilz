import React, { Component } from 'react'

export default class UploadImages extends Component {
  state = { images: [], uploadStatus: false }
  componentDidUpdate() {
    console.log(this.state.uploadStatus)
    console.log(
      this.state.images.length,
      this.state.images,
      'this.state.images'
    )
  }
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
  readAndCreateImgs = async files => {
    const sortedFiles = this.sortFilesByName(files)
    const createImg = (data, i) => {
      const img = (
        <img className='images' src={data} alt='uploaded images' key={i} />
      )
      return img
    }
    const promises = sortedFiles.map(async (file, i) => {
      const data = await this.readFile(file) //since await pauses execution until resolved/rejected, returned img is a promise
      const img = createImg(data, i)
      return img
    })

    return Promise.all(promises).then(results => {
      return results
    })
  }

  uploadFiles = e => {
    this.readAndCreateImgs(e.target.files)
      .then(results => {
        this.setState({ images: results })
        this.setState(prevState => ({
          uploadStatus: !prevState.uploadStatus
        }))
      })
      .catch(err => {
        console.error('Well that sucks:', err)
      })
  }

  render() {
    return (
      <div>
        <label htmlFor='upload-images'>Upload Images</label>
        <input
          id='upload-images'
          type='file'
          multiple='multiple'
          onChange={this.uploadFiles}
        />
      </div>
    )
  }
}
