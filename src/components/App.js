import React, { useState, useContext, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router'
import '../styles/App.scss'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import Navigation from './Navigation'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'
import CanvasList from './CanvasList'
import UploadImages from './UploadImages'
import Loader from '../common/Loader'

const RedirectRoute = ({ children, ...rest }) => {
  const history = useHistory()
  const { dispatch } = useContext(DataContext)

  const renderRedirect = () => {
    dispatch({ type: 'RESET' })
    return <Redirect to='/' />
  }

  return history.action === 'POP' ? (
    renderRedirect()
  ) : (
    <Route {...rest}>{children}</Route>
  )
}

const App = () => {
  const theme = useContext(ThemeContext)
  const { dark } = theme
  const { state } = useContext(DataContext)
  const { imgsLoaded, canvasesLoaded, canvasProcessStatus, loader } = state
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
        {loader && <Loader />}
        <RedirectRoute path='/' exact>
          <UploadImages />
        </RedirectRoute>
        <RedirectRoute path='/options' exact>
          <CanvasList />
        </RedirectRoute>
        <RedirectRoute path='/download'>
          <ProcessedCanvas />
        </RedirectRoute>
        <Redirect from='*' to='/' />
      </main>
      <Footer />
    </div>
  )
}

export default App
