import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sun from '../images/sun.svg'
import moon from '../images/moon.svg'
import ThemeContext from '../context/ThemeContext'

export default class Navigation extends Component {
  static contextType = ThemeContext

  state = {
    scrolled: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    if (window.scrollY > 20) {
      this.setState({ scrolled: true })
    } else {
      this.setState({ scrolled: false })
    }
  }

  renderThemeButton = theme => {
    return theme.dark ? (
      <span>
        <img src={sun} className='theme-icon' alt='Light Mode' />
      </span>
    ) : (
      <span>
        <img src={moon} className='theme-icon' alt='Dark Mode' />
      </span>
    )
  }
  render() {
    const { scrolled } = this.state
    const theme = this.context

    return (
      <header className={scrolled ? 'header scroll' : 'header'}>
        <nav className='nav'>
          <div className='brand'>
            <Link to='/'>
              <span className='text'>STITCH 'N' SLICE</span>
            </Link>
          </div>
          <div className='links'>
            <div className='cta-btn'>
              <button className='dark-switcher' onClick={theme.toggleTheme}>
                {this.renderThemeButton(theme)}
              </button>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}
