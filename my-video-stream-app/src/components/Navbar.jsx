import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Logout from './Logout'

const Navbar = () => {
  const { user } = useContext(AuthContext)

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.link}>
        Home
      </Link>
      {!user ? (
        <>
          <Link to='/login' style={styles.link}>
            Login
          </Link>
          <Link to='/register' style={styles.link}>
            Register
          </Link>
        </>
      ) : (
        <Logout />
      )}
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '5px 10px'
  }
}

export default Navbar
