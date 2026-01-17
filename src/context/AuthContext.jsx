import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('pulse_token')
    const saved = localStorage.getItem('pulse_user')
    if (token && saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await authService.login(email, password)
    localStorage.setItem('pulse_token', data.data.token)
    localStorage.setItem('pulse_user', JSON.stringify(data.data.user))
    setUser(data.data.user)
    return data.data.user
  }

  const logout = () => {
    localStorage.removeItem('pulse_token')
    localStorage.removeItem('pulse_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
