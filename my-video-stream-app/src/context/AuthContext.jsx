import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8800' // Ensure this matches your backend
})

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser () {
      try {
        const response = await api.get('/api/user/profile', {
          withCredentials: true
        })
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (email, password) => {
    try {
      await api.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      )
      const response = await api.get('/api/user/profile', {
        withCredentials: true
      })
      setUser(response.data)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {}, { withCredentials: true })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
