import React, { useContext } from 'react'
import { Route } from 'react-router-dom'
import '../styles/App.scss'
import ThemeContext from '../context/ThemeContext'
import Navigation from './Navigation'
import Main from './Main'
import CanvasList from './CanvasList'
import ProcessedCanvas from './ProcessedCanvas'
import Footer from './Footer'

const App = () => {
  const theme = useContext(ThemeContext)
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
      <main>
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
