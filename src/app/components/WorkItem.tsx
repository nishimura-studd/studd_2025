/* eslint-disable @next/next/no-html-link-for-pages */
import type { Work } from '@/lib/supabase'
import { extractStartYear } from '@/lib/utils'

interface WorkItemProps {
  work: Work
  onMaskedClick?: (workId: number) => void
}

export default function WorkItem({ work, onMaskedClick }: WorkItemProps) {
  const startYear = extractStartYear(work.terms)

  const handleClick = (e: React.MouseEvent) => {
    if (work.is_masked && onMaskedClick) {
      e.preventDefault()
      onMaskedClick(work.id)
    }
  }

  return (
    <a 
      href={`/works/${work.id}`}
      className="block transition-colors duration-200"
      onClick={handleClick}
      style={{
        background: 'var(--background)',
        border: 'none',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--background)'
      }}
    >
      <div className="space-y-6" style={{padding: '20px'}}>
        {/* タイトルと年 */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-light line-clamp-2 tracking-tight" style={{color: 'var(--foreground)'}}>
              {work.title}
            </h3>
          </div>
          {startYear && (
            <span className="text-sm font-light shrink-0 tracking-widest" style={{color: 'var(--foreground-subtle)'}}>
              {startYear}
            </span>
          )}
        </div>

        {/* スキル */}
        {work.skills && work.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
        )}
      </div>
    </a>
  )
}