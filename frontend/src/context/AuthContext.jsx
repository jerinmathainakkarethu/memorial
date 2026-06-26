import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('family_memorial_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })
  const [token, setToken] = useState(() => {
    return localStorage.getItem('family_memorial_token') || null;
  })

  const login = useCallback((userData, tokenStr) => {
    setUser(userData)
    setToken(tokenStr)
    localStorage.setItem('family_memorial_user', JSON.stringify(userData))
    localStorage.setItem('family_memorial_token', tokenStr)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('family_memorial_user')
    localStorage.removeItem('family_memorial_token')
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
