import React, { useState, useContext, useEffect } from 'react'
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
  const { canvasLoadStatus, uploadStatus } = useContext(DataContext)
  const { dark } = theme
  const [themeClass, setThemeClass] = useState('')
  const [mainClass, setMainClass] = useState('')

  useEffect(() => {
    if (canvasLoadStatus && !mainClass) {
      setMainClass('main-grid')
    }
    if (!canvasLoadStatus && !!mainClass) {
      setMainClass('')
    }
    const cleanup = () => {
      if (!canvasLoadStatus && !!mainClass) {
        setMainClass('')
      }
    }
    return cleanup
  }, [canvasLoadStatus, uploadStatus, mainClass])

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
