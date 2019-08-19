import React, { useContext } from 'react'
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
  const { canvasLoadStatus } = useContext(DataContext)
  const { dark } = theme

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
