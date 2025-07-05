const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const { createClient } = require('@supabase/supabase-js')

// 環境変数の読み込み
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL または API キーが設定されていません')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importCSV() {
  const csvFilePath = path.join(__dirname, '..', 'data', 'works.csv')
  const results = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // BOM を除去（CSVの先頭文字から）
        const cleanData = {}
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\uFEFF/, '') // BOM文字を除去
          cleanData[cleanKey] = data[key]
        })
        
        // skills を配列に変換
        const skills = cleanData.skills ? cleanData.skills.split(',').map(skill => skill.trim()) : []
        
        results.push({
          title: cleanData.title,
          terms: cleanData.terms,
          skills,
          description: cleanData.description,
          is_public: cleanData.is_public === 'true' || cleanData.is_public === 'Yes',
          image_url: cleanData.image_url || null,
          project_url: cleanData.project_url || null
        })
      })
      .on('end', async () => {
        try {
          console.log(`${results.length} 件のデータを読み込みました`)
          
          // 最初の1件をデバッグ出力
          if (results.length > 0) {
            console.log('サンプルデータ:', JSON.stringify(results[0], null, 2))
          }
          
          // Supabase にデータを挿入
          const { data, error } = await supabase
            .from('works')
            .insert(results)
            .select()

          if (error) {
            console.error('データ挿入エラー:', JSON.stringify(error, null, 2))
            reject(error)
          } else {
            console.log(`${data.length} 件のデータを正常に挿入しました`)
            resolve(data)
          }
        } catch (err) {
          console.error('処理エラー:', err)
          reject(err)
        }
      })
      .on('error', (err) => {
        console.error('CSV読み込みエラー:', err)
        reject(err)
      })
  })
}

// スクリプト実行
if (require.main === module) {
  importCSV()
    .then(() => {
      console.log('CSVインポートが完了しました')
      process.exit(0)
    })
    .catch((err) => {
      console.error('CSVインポートが失敗しました:', err)
      process.exit(1)
    })
}

module.exports = { importCSV }