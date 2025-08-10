/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useEffect, useState } from 'react'
import type { Work } from '@/lib/supabase'
import { getWorkByIdAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface WorkDetailClientProps {
  workId: string
  initialWork: Work | null
}

export default function WorkDetailClient({ workId, initialWork }: WorkDetailClientProps) {
  const { isAuthenticated } = useAuth()
  const [work, setWork] = useState<Work | null>(initialWork)
  const [, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialWork) {
      setError('Project not found')
      return
    }

    // 認証状態が変わった場合、データを再取得
    async function refetchWork() {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const data = await getWorkByIdAPI(Number(workId))
        if (data) {
          setWork(data)
        }
      } catch (err) {
        console.error('Failed to refetch work:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && initialWork.is_masked) {
      refetchWork()
    }
  }, [isAuthenticated, workId, initialWork])

  if (error || !work) {
    return (
      <div className="min-h-screen flex justify-center pt-8 md:pt-10" style={{background: 'var(--background)'}}>
        <div className="max-w-4xl w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <div style={{marginBottom: '100px'}}>
            <nav style={{height: '20px', alignItems: 'baseline'}}>
              <a
                href="/works"
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
                Back to Works
              </a>
            </nav>
          </div>

          <header>
            <h1 className="text-3xl md:text-5xl font-light" style={{color: 'var(--foreground)', lineHeight: '1.4', transform: 'translateY(-6px)'}}>404 Error</h1>
            <p className="text-sm md:text-base ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)', marginTop: '-40px'}}>{error || 'Project not found'}</p>
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
            <a
              href="/works"
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
              Back
            </a>
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
            <p className="text-sm md:text-base ml-3 md:ml-5" style={{color: 'var(--foreground-muted)', lineHeight: '28px', transform: 'translateY(-2px)', marginTop: '-40px'}}>
              {work.terms.includes('→') ? work.terms.replace(/\s*→\s*/g, ' 〜 ') : work.terms + ' 〜'}
            </p>
          )}
        </header>

        {/* 画像エリア */}
        {work.image_count && work.image_count > 0 && (
          <div style={{marginTop: '60px'}}>
            {Array.from({ length: work.image_count }, (_, index) => (
              <img
                key={index}
                src={`https://studd.jp/images/works/${work.id}_${index}.png`}
                alt={`${work.title} - ${index}`}
                className="w-full object-contain"
                style={{
                  border: '1px solid var(--border)',
                  marginBottom: index < work.image_count! - 1 ? '20px' : '0'
                }}
              />
            ))}
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