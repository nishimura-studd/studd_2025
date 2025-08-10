import { getPublicWorksAPI } from '@/lib/api'
import WorkDetailClient from './WorkDetailClient'

// 静的エクスポート用のパラメータ生成
export async function generateStaticParams() {
  try {
    const works = await getPublicWorksAPI()
    return works.map((work) => ({
      id: work.id.toString(),
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

interface WorkDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const resolvedParams = await params
  
  // 完全にクライアントサイドレンダリングに変更（DB更新対応）
  return <WorkDetailClient workId={resolvedParams.id} initialWork={null} />
}