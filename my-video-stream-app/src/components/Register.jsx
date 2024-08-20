import React, { useState } from 'react'
import axios from 'axios'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8800/api/auth/register', {
        email,
        password
      })
      alert('Registration successful! Please log in.')
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Register</h2>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={styles.input}
      />
      <button type='submit' style={styles.button}>
        Register
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28A745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  }
}

export default Register
