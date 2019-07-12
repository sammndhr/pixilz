import React, { Component } from 'react'
import '../styles/App.scss'
import Navigation from './Navigation.js'
import Main from './Main.js'
import ThemeContext from '../context/ThemeContext'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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
        {/* <Route path='/uploaded' exact render={() => <Uploaded />} /> */}
        {/* <Route path='/sliced' exact render={() => <Sliced />} /> */}
        <Route path='/' exact render={() => <Main />} />
        {/* <Route path='/' exact component={Main} />  */}
        {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
        <footer>Footer</footer>
      </div>
    )
  }
}

// class Uploaded {
//   stichAndSlice() {

//     //...your stuff
//     this.props.history.push('/sliced')
//   }
//   render() {
//     <div onClick={()=> {stichAndSlice()}}slice
//   }
// }

// class Sliced {

//   render() {
//     return (

//     )
//   }
// }