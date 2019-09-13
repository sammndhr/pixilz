import React, { useState, useEffect, useRef } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='/'>
        Stizzz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function ContactInfo() {
  const contactRef = useRef()
  const [showContact, setShowContact] = useState(false)
  useEffect(() => {
    if (showContact) {
      contactRef.current.innerHTML = `${contactRef.current.dataset.info}@gmail.com`
      document.addEventListener('click', closeContact)
    }
    return () => {
      document.removeEventListener('click', closeContact)
    }
  })

  const closeContact = event => {
    if (!contactRef.current.contains(event.target)) {
      setShowContact(false)
    }
  }
  return (
    <div align='center'>
      <Link
        align='center'
        to=''
        onClick={event => {
          event.preventDefault()
          setShowContact(true)
        }}>
        Contact
      </Link>

      {showContact ? (
        <Typography
          className='menu'
          ref={contactRef}
          data-info='stitch.n.slice'
          variant='body2'
          color='textSecondary'
          align='center'
        />
      ) : //so email stays hidden and can't be scraped by crawlers
      null}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: 'white'
  }
}))

export default function StickyFooter() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          <ContactInfo />
          <Copyright />
        </Container>
      </footer>
    </div>
  )
}
