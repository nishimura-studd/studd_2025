'use client'

import { useEffect, useState } from 'react'
import type { Work } from '@/lib/supabase'
import { getAllWorks } from '@/lib/works'
import WorkItem from '@/app/components/WorkItem'

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        {works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">作品がありません</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {works.map((work) => (
              <WorkItem key={work.id} work={work} />
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          {works.length > 0 && (
            <p>{works.length}件の作品を表示しています</p>
          )}
        </footer>
      </div>
    </div>
  )
}