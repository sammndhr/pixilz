import React, { useState, useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'
import '../styles/App.scss'
import { Box, Container } from '@material-ui/core/'
import ThemeContext from '../context/ThemeContext'
import DataContext from '../context/DataContext'
import Navigation from './Navigation'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'
import CanvasList from './CanvasList'
import UploadImages from './UploadImages'
import Loader from '../common/Loader'

const App = () => {
  const theme = useContext(ThemeContext)
  const { dark } = theme
  const { state } = useContext(DataContext)
  const { loader } = state
  const [themeClass, setThemeClass] = useState('')

  useEffect(() => {
    if (!dark) {
      setThemeClass('light')
    } else {
      setThemeClass('dark')
    }
  }, [themeClass, dark])

  return (
    <Box my={3} className={'App container ' + themeClass}>
      <Navigation />
      <Container>
        {loader && <Loader />}
        <Route path='/' exact render={() => <UploadImages />} />
        <Route path='/options' render={() => <CanvasList />} />
        <Route path='/download' render={() => <ProcessedCanvas />} />
      </Container>
      {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
      <Footer />
    </Box>
  )
}

export default App
