import React, { useState, useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'
import '../styles/App.scss'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import Navigation from './Navigation'
import Main from './Main'
import ImageList from './ImageList'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'

const App = () => {
  const theme = useContext(ThemeContext)
  const {
    canvasLoadStatus,
    canvasProcessStatus,
    dataUrls,
    imgsLoadStatus
  } = useContext(DataContext)
  const { dark } = theme
  const [themeClass, setThemeClass] = useState('')
  const [mainClass, setMainClass] = useState('')
  const [dataUrlsProps, setDataUrlsProps] = useState([])

  useEffect(() => {
    if (dataUrls.length && !dataUrlsProps.length) {
      setDataUrlsProps(dataUrls)
    }
  }, [dataUrls, dataUrlsProps])

  useEffect(() => {
    if (
      (imgsLoadStatus || canvasLoadStatus || canvasProcessStatus) &&
      !mainClass
    ) {
      setMainClass('main-grid')
    }
    if (
      !imgsLoadStatus &&
      !canvasLoadStatus &&
      !canvasProcessStatus &&
      !!mainClass
    ) {
      setMainClass('')
    }
    const cleanup = () => {
      if (
        !imgsLoadStatus &&
        !canvasLoadStatus &&
        !canvasProcessStatus &&
        !!mainClass
      ) {
        setMainClass('')
      }
    }
    return cleanup
  }, [imgsLoadStatus, canvasLoadStatus, canvasProcessStatus, mainClass])

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
        <Route
          path='/options'
          render={() => <ImageList dataUrls={dataUrlsProps} />}
        />
        <Route path='/download' render={() => <ProcessedCanvas />} />
      </main>
      {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
      <Footer />
    </div>
  )
}

export default App
