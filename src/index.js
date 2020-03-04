import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './components/App'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import * as serviceWorker from './serviceWorker'

ReactGA.initialize('UA-121879226-1')
ReactGA.pageview(window.location.pathname + window.location.search)

ReactDOM.render(
  <Router>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
