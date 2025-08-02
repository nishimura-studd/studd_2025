'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // パスワード状態変化時にボタンスタイルを更新
  useEffect(() => {
    if (buttonRef.current) {
      if (!password || loading) {
        // Disabled状態
        buttonRef.current.style.backgroundColor = '#ffffff'
        buttonRef.current.style.color = '#666666'
        buttonRef.current.style.borderColor = '#ffffff'
      } else {
        // Active状態
        buttonRef.current.style.backgroundColor = '#ffffff'
        buttonRef.current.style.color = '#000000'
        buttonRef.current.style.borderColor = 'hsl(153.1deg 60.2% 52.7% / 1)'
      }
    }
  }, [password, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const success = await login(password)
    
    if (success) {
      setPassword('')
      onSuccess()
      onClose()
    } else {
      setError('パスワードが間違っています')
      setPassword('')
    }
    setLoading(false)
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{background: 'rgba(0, 0, 0, 0.5)'}}
      onClick={handleClose}
    >
      <div 
        className="password-modal-content" 
        style={{background: '#000000', padding: '20px', minHeight: '300px', position: 'relative'}}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="hover:opacity-70 transition-opacity"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#ffffff',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col justify-center" style={{height: 'calc(100% - 40px)', paddingTop: '40px'}}>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div style={{width: '100%', marginBottom: '30px', marginTop: '40px'}}>
              <label htmlFor="password" className="block text-sm font-light" style={{color: '#ffffff', lineHeight: '20px', marginBottom: '16px'}}>
                PASSWORD :
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                className="w-full text-xs font-light transition-colors focus:outline-none"
                style={{
                  background: '#000000',
                  border: '1px solid #333333',
                  color: '#ffffff',
                  lineHeight: '16px',
                  height: '52px',
                  borderRadius: '4px',
                  padding: '12px 16px'
                } as React.CSSProperties}
                onFocus={(e) => {
                  e.target.style.borderColor = '#888888'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333'
                }}
                placeholder="パスワードを入力してください"
                disabled={loading}
                autoFocus
              />
              <div style={{height: '40px', display: 'flex', alignItems: 'center', marginTop: '4px'}}>
                {error && (
                  <p className="text-xs font-light" style={{color: '#ff6b6b', lineHeight: '16px', fontSize: '12px'}}>{error}</p>
                )}
              </div>
            </div>

            <button
              ref={buttonRef}
              type="submit"
              className="w-full transition-all duration-200 disabled:opacity-50"
              style={{
                padding: '15px 30px',
                backgroundColor: (!loading && password) ? '#ffffff' : '#ffffff',
                color: (!loading && password) ? '#000000' : '#666666',
                border: `1px solid ${(!loading && password) ? 'hsl(153.1deg 60.2% 52.7% / 1)' : '#ffffff'}`,
                borderRadius: '8px',
                cursor: (!loading && password) ? 'pointer' : 'default',
                fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '14px',
                fontWeight: '400',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!loading && password) {
                  e.currentTarget.style.backgroundColor = 'hsl(153.1deg 60.2% 52.7% / 1)'
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.borderColor = 'hsl(153.1deg 60.2% 52.7% / 1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && password) {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.borderColor = 'hsl(153.1deg 60.2% 52.7% / 1)'
                }
              }}
              disabled={loading || !password}
            >
              {loading ? '確認中...' : 'OK'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .password-modal-content {
          width: 100%;
          max-width: 28rem;
          margin: 0 1rem;
          border-radius: 12px;
        }
        
        @media (max-width: 767px) {
          .password-modal-content {
            width: 100vw;
            height: 100vh;
            max-width: none;
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  )
}