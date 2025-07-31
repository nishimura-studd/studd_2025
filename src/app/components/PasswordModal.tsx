'use client'

import { useState } from 'react'
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
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="card w-full max-w-md mx-4" style={{background: 'var(--background)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{color: 'var(--foreground)'}}>パスワード入力</h2>
          <button
            onClick={handleClose}
            className="hover:opacity-70 transition-opacity"
            style={{color: 'var(--foreground-muted)'}}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: 'var(--foreground)'}}>
              説明文
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="パスワードを入力してください"
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm" style={{color: 'var(--error)'}}>{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 swiss-button transition-colors"
              style={{
                background: 'var(--background-surface)',
                border: '1px solid var(--border)',
                color: 'var(--foreground-muted)'
              }}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 swiss-button transition-colors disabled:opacity-50"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                color: 'white'
              }}
              disabled={loading || !password}
            >
              {loading ? '確認中...' : 'OK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}