'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import type { Work } from '@/lib/supabase'
import { getPublicWorkByIdAPI, getWorkByIdAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

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
          setError('Project not found')
          return
        }
        setWork(data)
      } catch (err) {
        setError('プロジェクトデータの取得に失敗しました')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWork()
  }, [resolvedParams.id, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <div style={{marginBottom: '100px'}}>
            <nav style={{height: '20px', alignItems: 'baseline'}}>
              <button
                className="text-sm font-light flex items-center"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground)',
                  lineHeight: '20px',
                  padding: 0,
                  transform: 'translateX(-2px)',
                  cursor: 'default',
                  opacity: 0.5
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Back
              </button>
            </nav>
          </div>
          
          <header>
            <div className="h-12 w-3/4 animate-pulse" style={{background: 'var(--background-surface)', marginBottom: '40px'}}></div>
            <div className="h-4 w-48 ml-3 md:ml-5 animate-pulse" style={{background: 'var(--background-surface)', marginTop: '-40px'}}></div>
          </header>

          {/* 画像エリア */}
          <div style={{marginTop: '60px'}}>
            <div className="aspect-video w-full animate-pulse" style={{background: 'var(--background-surface)', borderRadius: '8px'}}></div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-8">
            {/* Overview */}
            <section style={{marginTop: '60px'}}>
              <h2 className="text-xl md:text-2xl font-light" style={{color: 'var(--foreground)', lineHeight: '32px', transform: 'translateY(-3px)', marginBottom: '40px', opacity: 0.5}}>Overview</h2>
              <div className="ml-3 md:ml-5 space-y-4 animate-pulse">
                <div className="h-4 w-full" style={{background: 'var(--background-surface)'}}></div>
                <div className="h-4 w-2/3" style={{background: 'var(--background-surface)'}}></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <div style={{marginBottom: '100px'}}>
            <nav style={{height: '20px', alignItems: 'baseline'}}>
              <button
                onClick={() => router.push('/')}
                className="text-sm font-light hover:opacity-70 transition-opacity duration-200 flex items-center"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground)',
                  lineHeight: '20px',
                  padding: 0,
                  transform: 'translateX(-2px)',
                  cursor: 'pointer'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Back to Home
              </button>
            </nav>
          </div>

          <header>
            <h1 className="text-3xl md:text-5xl font-light" style={{color: 'var(--foreground)', lineHeight: '1.4', transform: 'translateY(-6px)'}}>404 Error</h1>
            <p className="text-sm md:text-base ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)', marginTop: '-40px'}}>{error}</p>
          </header>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
      <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
        <div style={{marginBottom: '100px'}}>
          <nav style={{height: '20px', alignItems: 'baseline'}}>
            <button
              onClick={() => router.back()}
              className="text-sm font-light hover:opacity-70 transition-opacity duration-200 flex items-center"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground)',
                lineHeight: '20px',
                padding: 0,
                transform: 'translateX(-2px)',
                cursor: 'pointer'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Back
            </button>
          </nav>
        </div>

        <header>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-light" style={{color: 'var(--foreground)', lineHeight: '1.4', transform: 'translateY(-6px)'}}>{work.title}</h1>
            {work.is_masked && (
              <span className="badge badge-warning">
                Limited Access
              </span>
            )}
          </div>
          {work.terms && (
            <p className="text-sm md:text-base ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)', marginTop: '-40px'}}>{work.terms.replace(/\s*→\s*/g, ' 〜 ')}</p>
          )}
        </header>

        {/* 画像エリア */}
        {work.images && work.images.length > 0 ? (
          <div style={{marginTop: '60px'}}>
            {work.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${work.title} - ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg"
                style={{
                  border: '1px solid var(--border)',
                  marginBottom: index < work.images.length - 1 ? '20px' : '0'
                }}
              />
            ))}
          </div>
        ) : work.image_url && (
          <div style={{marginTop: '60px'}}>
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
            <section style={{marginBottom: '20px', marginTop: '60px'}}>
              <h2 className="text-xl md:text-2xl font-light" style={{color: 'var(--foreground)', lineHeight: '32px', transform: 'translateY(-3px)', marginBottom: '40px'}}>Overview</h2>
              <p className="text-sm md:text-base ml-3 md:ml-5 whitespace-pre-line" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)'}}>
                {work.description}
              </p>
            </section>
          )}

          {/* スキル */}
          {work.skills && work.skills.length > 0 && (
            <section style={{marginBottom: '60px'}}>
              <div className="flex flex-wrap gap-2 ml-3 md:ml-5">
                {work.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-light"
                    style={{
                      background: 'transparent',
                      color: 'var(--foreground-muted)',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      lineHeight: '16px'
                    }}
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* リンク */}
          {work.project_url && (
            <section style={{marginBottom: '60px'}}>
              <h2 className="text-xl md:text-2xl font-light" style={{color: 'var(--foreground)', lineHeight: '32px', transform: 'translateY(-3px)', marginBottom: '40px'}}>Links</h2>
              <div className="ml-3 md:ml-5">
                <a
                  href={work.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-light hover:opacity-70 transition-opacity duration-200"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                    border: 'none',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  View Project
                  <span style={{marginLeft: '8px'}}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}