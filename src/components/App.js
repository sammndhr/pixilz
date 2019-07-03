import React, { Component } from 'react'
import '../styles/App.scss'
import Navigation from './Navigation.js'
import Main from './Main.js'
import ThemeContext from '../context/ThemeContext'

export default class App extends Component {
  static contextType = ThemeContext
  render() {
    const { dark } = this.context
    let themeClass = ''
    if (!dark) {
      themeClass = 'light'
    } else {
      themeClass = 'dark'
    }
    return (
      <div className={'App container ' + themeClass}>
        <Navigation />

        <Main />

        <footer>Footer</footer>
      </div>
    )
  }
}
