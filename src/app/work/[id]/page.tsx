'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import type { Work } from '@/lib/supabase'
import { getPublicWorkByIdAPI, getWorkByIdAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { extractStartYear } from '@/lib/utils'

interface WorkDetailProps {
  params: Promise<{
    id: string
  }>
}

export default function WorkDetail({ params }: WorkDetailProps) {
  const resolvedParams = use(params)
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchWork() {
      try {
        setLoading(true)
        const data = isAuthenticated 
          ? await getWorkByIdAPI(resolvedParams.id)
          : await getPublicWorkByIdAPI(resolvedParams.id)
        if (!data) {
          setError('作品が見つかりませんでした')
          return
        }
        setWork(data)
      } catch (err) {
        setError('作品データの取得に失敗しました')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWork()
  }, [resolvedParams.id, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="aspect-video bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  const startYear = extractStartYear(work.terms)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 戻るボタン */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work
          </button>
        </div>

        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{work.title}</h1>
              {work.is_masked && (
                <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-md">
                  Limited Access
                </span>
              )}
            </div>
            {startYear && (
              <span className="text-lg text-gray-500 font-medium shrink-0">{startYear}</span>
            )}
          </div>
          {work.terms && (
            <p className="text-gray-600">{work.terms}</p>
          )}
        </header>

        {/* 画像エリア */}
        {work.images && work.images.length > 0 ? (
          <div className="mb-8 space-y-4">
            {work.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${work.title} - ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        ) : work.image_url && (
          <div className="mb-8">
            <img
              src={work.image_url}
              alt={work.title}
              className="w-full aspect-video object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* 詳細情報 */}
        <div className="space-y-8">
          {/* 説明 */}
          {work.description && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {work.description}
              </p>
            </section>
          )}

          {/* スキル */}
          {work.skills && work.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {work.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* リンク */}
          {work.project_url && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
              <div className="flex gap-4">
                <a
                  href={work.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Project
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}