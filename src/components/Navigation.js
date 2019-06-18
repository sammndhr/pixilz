import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sun from '../images/sun.svg'
export default class Navigation extends Component {
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
      console.log(window.scrollY)
    } else {
      console.log(window.scrollY)
      this.setState({ scrolled: false })
    }
  }
  render() {
    const { scrolled } = this.state
    console.log(scrolled)
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
              <Link to='/' className='dark-switcher'>
                <img src={sun} className='theme-icon' alt='Light Mode' />
              </Link>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}
