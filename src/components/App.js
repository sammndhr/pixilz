import React, { useState, useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'
import '../styles/App.scss'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import Navigation from './Navigation'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'
import CanvasList from './CanvasList'
import UploadImages from './UploadImages'

const App = () => {
  const theme = useContext(ThemeContext)
  const { dark } = theme
  const { state } = useContext(DataContext)
  const { imgsLoaded, canvasesLoaded, canvasProcessStatus } = state
  const [themeClass, setThemeClass] = useState('')
  const [mainClass, setMainClass] = useState('')
  useEffect(() => {
    if ((imgsLoaded || canvasesLoaded || canvasProcessStatus) && !mainClass) {
      setMainClass('main-grid')
    }
    if (!imgsLoaded && !canvasesLoaded && !canvasProcessStatus && !!mainClass) {
      setMainClass('')
    }
    const cleanup = () => {
      if (
        !imgsLoaded &&
        !canvasesLoaded &&
        !canvasProcessStatus &&
        !!mainClass
      ) {
        setMainClass('')
      }
    }
    return cleanup
  }, [imgsLoaded, canvasesLoaded, canvasProcessStatus, mainClass])

  useEffect(() => {
    if (!dark) {
      setThemeClass('light')
    } else {
      setThemeClass('dark')
    }
  }, [themeClass, dark])

  return (
    <div className={'App container ' + themeClass}>
      <Navigation />
      <main className={mainClass}>
        <Route path='/' exact render={() => <UploadImages />} />
        <Route path='/options' render={() => <CanvasList />} />
        <Route path='/download' render={() => <ProcessedCanvas />} />
      </main>
      {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
      <Footer />
    </div>
  )
}

export default App
