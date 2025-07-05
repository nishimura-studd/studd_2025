import Link from 'next/link'
import type { Work } from '@/lib/supabase'
import { extractStartYear } from '@/lib/utils'

interface WorkItemProps {
  work: Work
}

export default function WorkItem({ work }: WorkItemProps) {
  const startYear = extractStartYear(work.terms)

  return (
    <Link 
      href={`/work/${work.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="space-y-3">
        {/* タイトルと年 */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {work.title}
          </h3>
          {startYear && (
            <span className="text-sm text-gray-500 font-medium shrink-0">
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
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
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