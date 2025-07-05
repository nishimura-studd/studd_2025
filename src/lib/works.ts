import { supabase, type Work } from './supabase'

/**
 * 公開されている作品データを全て取得
 */
export async function getPublicWorks(): Promise<Work[]> {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('作品データの取得に失敗しました:', error)
    return []
  }

  return data || []
}

/**
 * 全ての作品データを取得（管理用）
 */
export async function getAllWorks(): Promise<Work[]> {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('作品データの取得に失敗しました:', error)
    return []
  }

  return data || []
}

/**
 * 特定のIDの作品データを取得
 */
export async function getWorkById(id: string): Promise<Work | null> {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('作品データの取得に失敗しました:', error)
    return null
  }

  return data
}

/**
 * スキルでフィルタリングした作品データを取得
 */
export async function getWorksBySkill(skill: string): Promise<Work[]> {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .contains('skills', [skill])
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('作品データの取得に失敗しました:', error)
    return []
  }

  return data || []
}