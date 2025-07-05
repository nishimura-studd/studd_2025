/**
 * 期間文字列から開始年を抽出する
 * @param terms - "2024/02/06 → 2024/08/10" のような形式の文字列
 * @returns 開始年（例: "2024"）または空文字列
 */
export function extractStartYear(terms: string | null): string {
  if (!terms) return ''
  
  // 最初の4桁の数字を抽出（年として）
  const yearMatch = terms.match(/(\d{4})/)
  return yearMatch ? yearMatch[1] : ''
}

/**
 * class名を条件付きで結合するユーティリティ
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}