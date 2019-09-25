import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import sun from '../images/sun.svg'
import moon from '../images/moon.svg'
import ThemeContext from '../context/ThemeContext'
import { Button } from '../common/Button'

const Navigation = () => {
  const theme = useContext(ThemeContext)
  const [scrolled, setscrolled] = useState(false)
  const [headerClass, setheaderClass] = useState('header')

  useEffect(() => {
    setheaderClass(scrolled ? 'header scroll' : 'header')
  }, [scrolled])

  useEffect(() => {
    const handleScroll = () => {
      setscrolled(window.scrollY > 20 ? true : false)
    }
    window.addEventListener('scroll', handleScroll)
    const cleanup = () => {
      window.removeEventListener('scroll', handleScroll)
    }
    return cleanup
  }, [])

  const renderThemeButton = theme => {
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

  return (
    <header className={headerClass}>
      <nav className='nav'>
        <div className='brand'>
          <Link to='/'>
            <span className='text'>STITCH 'N' SLICE</span>
          </Link>
        </div>
        <div className='links'>
          <Button
            className='dark-switcher'
            handleClick={theme.toggleTheme}
            content={renderThemeButton(theme)}
          />
        </div>
      </nav>
    </header>
  )
}

export default Navigation
