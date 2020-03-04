import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import DataContext from '../context/DataContext'
import ThemeContext from '../context/ThemeContext'
import Loader from '../smallComponents/Loader'
import '../styles/App.scss'
import CanvasList from './CanvasList'
import Footer from './Footer'
import Navigation from './Navigation'
import ProcessedCanvas from './ProcessedCanvas'
import UploadImages from './UploadImages'

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
  const [display, setDisplay] = useState('none')

  useEffect(() => {
    loader ? setDisplay('none') : setDisplay('')
  }, [loader])

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
      {loader && <Loader />}
      <main style={{ display }} className={mainClass}>
        <Switch>
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
        </Switch>
      </main>
      <Footer />
    </div>
  )
}

export default App
