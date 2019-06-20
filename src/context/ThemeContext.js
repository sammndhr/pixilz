import React, { Component } from 'react'

const defaultState = {
  dark: false,
  toggleTheme: () => {}
}

const ThemeContext = React.createContext(defaultState)

class ThemeProvider extends Component {
  state = {
    dark: false
  }
  componentDidMount() {
    const dark = JSON.parse(localStorage.getItem('dark'))

    if (dark) {
      this.setState({ dark })
    }
  }

  componentDidUpdate(prevState) {
    const { dark } = this.state

    if (prevState.dark !== dark) {
      localStorage.setItem('dark', JSON.stringify(dark))
    }
  }

  toggleTheme = () => {
    this.setState(prevState => ({ dark: !prevState.dark }))
  }

  render() {
    const { children } = this.props
    const { dark } = this.state

    return (
      <ThemeContext.Provider
        value={{
          dark,
          toggleTheme: this.toggleTheme
        }}>
        {children}
      </ThemeContext.Provider>
    )
  }
}

export default ThemeContext

export { ThemeProvider }
