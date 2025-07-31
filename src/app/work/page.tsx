'use client'

import { useEffect, useState, useMemo } from 'react'
import type { Work } from '@/lib/supabase'
import { getPublicWorksAPI, getAllWorksAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import WorkItem from '@/app/components/WorkItem'
import PasswordModal from '@/app/components/PasswordModal'

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, setSelectedWorkId] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true)
        const data = isAuthenticated ? await getAllWorksAPI() : await getPublicWorksAPI()
        setWorks(data)
      } catch (err) {
        setError('データの取得に失敗しました')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorks()
  }, [isAuthenticated])

  // 全スキルの一覧を生成
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>()
    works.forEach(work => {
      work.skills.forEach(skill => skillSet.add(skill))
    })
    return Array.from(skillSet).sort()
  }, [works])

  // フィルタリングされた作品リスト
  const filteredWorks = useMemo(() => {
    if (selectedSkill === 'all') {
      return works
    }
    return works.filter(work => work.skills.includes(selectedSkill))
  }, [works, selectedSkill])

  // マスクされたプロジェクトのクリック処理
  const handleMaskedClick = (workId: string) => {
    setSelectedWorkId(workId)
    setIsModalOpen(true)
  }

  // パスワード認証成功時の処理
  const handleAuthSuccess = async () => {
    try {
      setLoading(true)
      const data = await getAllWorksAPI()
      setWorks(data)
    } catch (err) {
      setError('データの取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center py-8" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 rounded w-48" style={{background: 'var(--background-surface)'}}></div>
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg" style={{background: 'var(--background-surface)'}}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center py-8" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{color: 'var(--foreground)'}}>エラー</h1>
            <p style={{color: 'var(--foreground-muted)'}}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center py-8" style={{background: 'var(--background)'}}>
      <div className="max-w-4xl w-full px-4">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--foreground)'}}>Works</h1>
          <p style={{color: 'var(--foreground-muted)'}}>
            これまでに携わったプロジェクトの一覧です
          </p>
        </header>

        {/* スキルフィルター */}
        {allSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6" style={{color: 'var(--foreground)'}}>Filter</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSkill('all')}
                className={`swiss-button ${selectedSkill === 'all' ? 'badge-accent' : ''}`}
                style={{
                  background: selectedSkill === 'all' ? 'var(--accent)' : 'var(--background-surface)',
                  color: selectedSkill === 'all' ? 'var(--background)' : 'var(--foreground)',
                  border: `1px solid ${selectedSkill === 'all' ? 'var(--accent)' : 'var(--border)'}`
                }}
              >
                All ({works.length})
              </button>
              {allSkills.map((skill) => {
                const count = works.filter(work => work.skills.includes(skill)).length
                const isSelected = selectedSkill === skill
                return (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className="swiss-button"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'var(--background-surface)',
                      color: isSelected ? 'var(--background)' : 'var(--foreground)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`
                    }}
                  >
                    {skill} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <p style={{color: 'var(--foreground-subtle)'}}>
              {selectedSkill === 'all' ? 'データがありません' : `${selectedSkill}のプロジェクトがありません`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredWorks.map((work) => (
              <WorkItem key={work.id} work={work} onMaskedClick={handleMaskedClick} />
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-sm">
          {filteredWorks.length > 0 && (
            <p style={{color: 'var(--foreground-subtle)'}}>
              {selectedSkill === 'all' 
                ? `${filteredWorks.length}件のプロジェクトを表示しています`
                : `${selectedSkill}: ${filteredWorks.length}件のプロジェクトを表示しています`
              }
            </p>
          )}
        </footer>

        {/* パスワードモーダル */}
        <PasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  )
}