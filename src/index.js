import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

import { BrowserRouter as Router } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { ThemeProvider } from '@material-ui/styles'
import { DataProvider } from './context/DataContext'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from './theme'
console.log(theme)
ReactDOM.render(
  //todo: change to use history instead of forceRefresh
  // <Router forceRefresh={true}>
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
