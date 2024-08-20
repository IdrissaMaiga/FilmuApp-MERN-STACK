import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Logout = () => {
  const { logout } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  )
}

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}

export default Logout
