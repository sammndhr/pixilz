import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './components/App'
import Canvas from './components/Canvas'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
ReactDOM.render(
  <Router>
    <ThemeProvider>
      <DataProvider>
        <Route path='/' exact component={App} />
        <Route path='/canvas' component={Canvas} />
      </DataProvider>
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
