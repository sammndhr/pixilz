import React, { Component, useContext } from 'react'
import '../styles/App.scss'
import Navigation from './Navigation'
import Main from './Main'
import ThemeContext from '../context/ThemeContext'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ImageList from './ImageList'
import UploadImages from './UploadImages'

import DataContext from '../context/DataContext'

const App = () => {
  const theme = useContext(ThemeContext)
  const data = useContext(DataContext)

  const { dark } = theme
  let themeClass = ''
  if (!dark) {
    themeClass = 'light'
  } else {
    themeClass = 'dark'
  }
  return (
    <div className={'App container ' + themeClass}>
      <Navigation />

      {/* <Route path='/sliced' exact render={() => <Sliced />} /> */}
      <Route path='/' exact render={() => <Main />} />
      <main>
        <Route
          path='/options'
          render={() => (
            <ImageList ref={data.imageRef} dataUrls={data.dataUrls} />
          )}
        />
      </main>
      {/* <Route path='/' exact component={Main} />  */}
      {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
      <footer>Footer</footer>
    </div>
  )
}

export default App
// class Uploaded {
//   stichAndSlice() {

//     //...your stuff
//     this.props.history.push('/sliced')
//   }
//   render() {
//     <div onClick={()=> {stichAndSlice()}}slice
//   }
// }

// class Sliced {

//   render() {
//     return (

//     )
//   }
// }
