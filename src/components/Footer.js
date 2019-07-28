import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
//TODO. Change email to form
const Footer = () => {
  const contactRef = useRef()
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    if (showContact) {
      contactRef.current.innerHTML = `${
        contactRef.current.dataset.info
      }@gmail.com`
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
    <footer>
      <Link
        to=''
        onClick={event => {
          event.preventDefault()
          setShowContact(true)
        }}>
        Contact
      </Link>
      {showContact ? (
        <p className='menu' ref={contactRef} data-info='stitch.n.slice' /> //so email stays hidden and can't be scraped by crawlers
      ) : null}
    </footer>
  )
}
export default Footer
