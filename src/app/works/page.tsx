/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Work } from '@/lib/supabase'
import { getPublicWorksAPI, getAllWorksAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import WorkItem from '@/app/components/WorkItem'
import PasswordModal from '@/app/components/PasswordModal'

function WorkPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string>(() => {
    return searchParams.get('filter') || 'all'
  })
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

  // スキルフィルターの変更処理
  const handleSkillChange = (skill: string) => {
    setSelectedSkill(skill)
    
    // URLを更新
    const params = new URLSearchParams(searchParams)
    if (skill === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', skill)
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(`/works${newUrl}`, { scroll: false })
  }

  // マスクされたプロジェクトのクリック処理
  const handleMaskedClick = (workId: number) => {
    setSelectedWorkId(workId.toString())
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
      <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <div style={{marginBottom: '100px'}}>
            <nav style={{height: '20px', alignItems: 'baseline'}}>
              <a 
                href="/" 
                className="text-sm font-light hover:opacity-70 transition-opacity duration-200 flex items-center"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground)',
                  lineHeight: '20px',
                  padding: 0,
                  transform: 'translateX(-2px)',
                  textDecoration: 'none'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Home
              </a>
            </nav>
          </div>
          
          <header style={{marginBottom: '80px'}}>
            <h1 className="text-3xl md:text-5xl" style={{color: 'var(--foreground)', lineHeight: '48px', transform: 'translateY(-6px)', marginBottom: '40px'}}>Works</h1>
          </header>

          {/* FILTER プレイスホルダー */}
          <div style={{marginBottom: '60px'}}>
            <h2 className="text-sm font-light" style={{color: 'var(--foreground)', lineHeight: '20px', marginBottom: '20px', fontSize: '14px'}}>FILTER</h2>
            <div className="flex flex-wrap gap-2 ml-3 md:ml-5 animate-pulse">
              <div className="h-4 w-16 my-1" style={{background: 'var(--background-surface)'}}></div>
              <div className="h-4 w-20 my-1" style={{background: 'var(--background-surface)'}}></div>
              <div className="h-4 w-24 my-1" style={{background: 'var(--background-surface)'}}></div>
            </div>
          </div>

          {/* WorkItem プレイスホルダー */}
          <div className="animate-pulse space-y-8" style={{marginBottom: '60px'}}>
            <div className="swiss-line"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="space-y-6" style={{padding: '20px', height: '128px'}}>
                  <div className="flex items-start justify-between gap-6" style={{height: '60px'}}>
                    <div className="h-3 w-64 my-1" style={{background: 'var(--background-surface)'}}></div>
                    <div className="h-2 w-12 my-1" style={{background: 'var(--background-surface)'}}></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-3 w-16 my-1" style={{background: 'var(--background-surface)'}}></div>
                    <div className="h-3 w-20 my-1" style={{background: 'var(--background-surface)'}}></div>
                  </div>
                </div>
                {i < 2 && <div className="swiss-line"></div>}
              </div>
            ))}
            <div className="swiss-line"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl" style={{color: 'var(--foreground)', lineHeight: '48px', transform: 'translateY(-6px)', marginBottom: '40px'}}>エラー</h1>
            <p className="text-sm md:text-base" style={{color: 'var(--foreground-muted)', lineHeight: '28px'}}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
      <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
        <div style={{marginBottom: '100px'}}>
          <nav style={{height: '20px', alignItems: 'baseline'}}>
            <a 
              href="/" 
              className="text-sm font-light hover:opacity-70 transition-opacity duration-200 flex items-center"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground)',
                lineHeight: '20px',
                padding: 0,
                transform: 'translateX(-2px)',
                textDecoration: 'none'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Home
            </a>
          </nav>
        </div>
        
        <header style={{marginBottom: '80px'}}>
          <h1 className="text-3xl md:text-5xl" style={{color: 'var(--foreground)', lineHeight: '48px', transform: 'translateY(-6px)', marginBottom: '40px'}}>Works</h1>
        </header>

        {/* スキルフィルター */}
        {allSkills.length > 0 && (
          <div style={{marginBottom: '60px'}}>
            <h2 className="text-sm font-light" style={{color: 'var(--foreground)', lineHeight: '20px', marginBottom: '20px', fontSize: '14px'}}>FILTER</h2>
            <div className="flex flex-wrap gap-2 ml-3 md:ml-5">
              <button
                onClick={() => handleSkillChange('all')}
                className={`text-xs font-light ${selectedSkill === 'all' ? '' : 'hover:opacity-70'} transition-opacity duration-200`}
                style={{
                  background: selectedSkill === 'all' ? 'var(--foreground)' : 'transparent',
                  color: selectedSkill === 'all' ? 'var(--background)' : 'var(--foreground-muted)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  lineHeight: '16px',
                  cursor: selectedSkill === 'all' ? 'default' : 'pointer'
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
                    onClick={() => handleSkillChange(skill)}
                    className={`text-xs font-light ${isSelected ? '' : 'hover:opacity-70'} transition-opacity duration-200`}
                    style={{
                      background: isSelected ? 'var(--foreground)' : 'transparent',
                      color: isSelected ? 'var(--background)' : 'var(--foreground-muted)',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      lineHeight: '16px',
                      cursor: isSelected ? 'default' : 'pointer'
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
          <div className="space-y-8" style={{marginBottom: '60px'}}>
            {/* 上部の罫線 */}
            <div className="swiss-line"></div>
            
            {filteredWorks.map((work, index) => (
              <div key={work.id} className="space-y-8">
                <WorkItem work={work} onMaskedClick={handleMaskedClick} />
                {/* 各アイテム間の罫線 */}
                {index < filteredWorks.length - 1 && (
                  <div className="swiss-line"></div>
                )}
              </div>
            ))}
            
            {/* 下部の罫線 */}
            <div className="swiss-line"></div>
          </div>
        )}

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

export default function WorkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkPageContent />
    </Suspense>
  )
}