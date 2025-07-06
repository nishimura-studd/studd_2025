'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authenticateAdmin, logout as apiLogout, isAuthenticated as checkStoredAuth } from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshData: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const checkAuth = () => {
    setIsAuthenticated(checkStoredAuth())
  }

  const login = async (password: string): Promise<boolean> => {
    const success = await authenticateAdmin(password)
    if (success) {
      setIsAuthenticated(true)
      setRefreshTrigger(prev => prev + 1) // データ再取得をトリガー
    }
    return success
  }

  const logout = async () => {
    await apiLogout()
    setIsAuthenticated(false)
    setRefreshTrigger(prev => prev + 1) // データ再取得をトリガー
  }

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}