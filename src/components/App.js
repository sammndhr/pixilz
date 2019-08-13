import React, { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import '../styles/App.scss'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import Navigation from './Navigation'
import Main from './Main'
import CanvasList from './CanvasList'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'

const App = () => {
  const theme = useContext(ThemeContext)
  const { canvasLoadStatus, dimensions } = useContext(DataContext)
  const { dark } = theme
  const [maxWidth, setMaxWidth] = useState(1400)
  const [style, setStyle] = useState({})

  // gridTemplateColumns: minmax(300px, maxWidth) minmax(min-content, 33%); //set max
  let themeClass = '',
    mainClass = ''

  if (canvasLoadStatus) {
    mainClass = 'main-grid'
  }
  if (!dark) {
    themeClass = 'light'
  } else {
    themeClass = 'dark'
  }

  useEffect(() => {
    if (dimensions && dimensions.w && dimensions.w.max) {
      setMaxWidth(dimensions.w.max)
      setStyle({
        maxWidth: `${maxWidth + 512 + 24 + 24}px`,
        gridTemplateColumns: `minmax(66%, max-content) minmax(min-content,  512px)`
      })
    }
  }, [canvasLoadStatus, dimensions, maxWidth])

  return (
    <div className={'App container ' + themeClass}>
      <Navigation />
      <main className={mainClass} style={style}>
        <Route path='/' exact render={() => <Main />} />
        <Route path='/options' render={() => <CanvasList />} />
        <Route path='/download' render={() => <ProcessedCanvas />} />
      </main>
      {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
      <Footer />
    </div>
  )
}

export default App
