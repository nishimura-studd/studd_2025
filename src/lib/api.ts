import { supabase, type Work } from './supabase'

// 認証トークンをローカルストレージで管理
const TOKEN_KEY = 'admin_auth_token'
const EXPIRES_KEY = 'admin_auth_expires'

interface AuthResult {
  success: boolean
  token?: string
  expires_at?: string
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem(TOKEN_KEY)
  const expires = localStorage.getItem(EXPIRES_KEY)
  
  if (!token || !expires) return null
  
  // 有効期限チェック
  if (new Date(expires) <= new Date()) {
    removeStoredToken()
    return null
  }
  
  return token
}

export function setStoredToken(token: string, expiresAt: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_KEY, expiresAt)
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

/**
 * パスワード認証（トークン取得）
 */
export async function authenticateAdmin(password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('authenticate_admin', {
      input_password: password
    })

    if (error) {
      console.error('認証エラー:', error)
      console.error('エラー詳細:', JSON.stringify(error, null, 2))
      return false
    }

    const result = data?.[0] as AuthResult
    
    if (result?.success && result.token && result.expires_at) {
      setStoredToken(result.token, result.expires_at)
      return true
    }

    return false
  } catch (error) {
    console.error('認証処理でエラーが発生しました:', error)
    return false
  }
}

/**
 * ログアウト（トークン削除）
 */
export async function logout(): Promise<void> {
  const token = getStoredToken()
  
  if (token) {
    try {
      await supabase.rpc('logout_admin', { auth_token: token })
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }
  
  removeStoredToken()
}

/**
 * 認証状態確認
 */
export function isAuthenticated(): boolean {
  return getStoredToken() !== null
}

/**
 * 全ての作品データを取得（Supabase RPC経由、マスク機能付き）
 */
export async function getAllWorksAPI(): Promise<Work[]> {
  try {
    const token = getStoredToken()
    
    const { data, error } = await supabase.rpc('get_works_with_auth', {
      auth_token: token
    })
    
    if (error) {
      console.error('作品データの取得に失敗しました:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('作品データの取得に失敗しました:', error)
    return []
  }
}

/**
 * 特定のIDの作品データを取得（Supabase RPC経由、マスク機能付き）
 */
export async function getWorkByIdAPI(id: number): Promise<Work | null> {
  try {
    const token = getStoredToken()
    
    const { data, error } = await supabase.rpc('get_work_by_id_with_auth', {
      work_id: id,
      auth_token: token
    })
    
    if (error) {
      console.error('作品データの取得に失敗しました:', error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error('作品データの取得に失敗しました:', error)
    return null
  }
}

/**
 * パスワードなしで全ての作品データを取得（マスクされたデータ）
 */
export async function getPublicWorksAPI(): Promise<Work[]> {
  try {
    const { data, error } = await supabase.rpc('get_works_with_auth', {
      auth_token: null
    })
    
    if (error) {
      console.error('作品データの取得に失敗しました:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('作品データの取得に失敗しました:', error)
    return []
  }
}

/**
 * パスワードなしで特定IDの作品データを取得（マスクされたデータ）
 */
export async function getPublicWorkByIdAPI(id: number): Promise<Work | null> {
  try {
    const { data, error } = await supabase.rpc('get_work_by_id_with_auth', {
      work_id: id,
      auth_token: null
    })
    
    if (error) {
      console.error('作品データの取得に失敗しました:', error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error('作品データの取得に失敗しました:', error)
    return null
  }
}