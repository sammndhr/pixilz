import React, { useContext } from 'react'
import '../styles/App.scss'
import Navigation from './Navigation'
import Main from './Main'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CanvasList from './CanvasList'

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
      <Route path='/' exact render={() => <Main />} />
      <main>
        {/* <Route
          path='/download'
          render={() => <Canvas ref={canvasRef} forwardedRef={imgRef} />}
        /> */}
        <Route path='/options' render={() => <CanvasList />} />
      </main>
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
