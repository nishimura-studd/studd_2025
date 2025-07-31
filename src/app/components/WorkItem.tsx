import Link from 'next/link'
import type { Work } from '@/lib/supabase'
import { extractStartYear } from '@/lib/utils'

interface WorkItemProps {
  work: Work
  onMaskedClick?: (workId: string) => void
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
    <Link 
      href={`/work/${work.id}`}
      className="card block hover:scale-[1.02] transition-all duration-200"
      onClick={handleClick}
      style={{
        background: 'var(--background-surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="space-y-4">
        {/* タイトルと年 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold line-clamp-2" style={{color: 'var(--foreground)'}}>
              {work.title}
            </h3>
            {work.is_masked && (
              <span className="badge badge-warning">
                Limited
              </span>
            )}
          </div>
          {startYear && (
            <span className="text-sm font-medium shrink-0" style={{color: 'var(--foreground-subtle)'}}>
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
                className="badge"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}