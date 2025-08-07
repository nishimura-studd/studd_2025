import { getPublicWorkByIdAPI, getPublicWorksAPI } from '@/lib/api'
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
  
  // サーバーサイドで初期データを取得
  let initialWork = null
  try {
    initialWork = await getPublicWorkByIdAPI(Number(resolvedParams.id))
  } catch (error) {
    console.error('Failed to fetch work:', error)
  }

  return <WorkDetailClient workId={resolvedParams.id} initialWork={initialWork} />
}