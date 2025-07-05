'use client'

import { useEffect, useState, useMemo } from 'react'
import type { Work } from '@/lib/supabase'
import { getAllWorks } from '@/lib/works'
import WorkItem from '@/app/components/WorkItem'

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string>('all')

  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true)
        const data = await getAllWorks()
        setWorks(data)
      } catch (err) {
        setError('作品データの取得に失敗しました')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorks()
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Works</h1>
          <p className="text-gray-600 mt-2">
            これまでに携わったプロジェクトの一覧です
          </p>
        </header>

        {/* スキルフィルター */}
        {allSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">スキルで絞り込み</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSkill('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedSkill === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                すべて ({works.length})
              </button>
              {allSkills.map((skill) => {
                const count = works.filter(work => work.skills.includes(skill)).length
                return (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedSkill === skill
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
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
            <p className="text-gray-500">
              {selectedSkill === 'all' ? '作品がありません' : `${selectedSkill}の作品がありません`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredWorks.map((work) => (
              <WorkItem key={work.id} work={work} />
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          {filteredWorks.length > 0 && (
            <p>
              {selectedSkill === 'all' 
                ? `${filteredWorks.length}件の作品を表示しています`
                : `${selectedSkill}: ${filteredWorks.length}件の作品を表示しています`
              }
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}