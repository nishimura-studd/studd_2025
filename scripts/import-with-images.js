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

// 画像アップロード関数
async function uploadImage(filePath, fileName) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`画像ファイルが見つかりません: ${filePath}`)
      return null
    }

    const fileBuffer = fs.readFileSync(filePath)
    const fileExtension = path.extname(filePath)
    
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }
    
    const contentType = contentTypes[fileExtension.toLowerCase()] || 'application/octet-stream'
    
    const { data, error } = await supabase.storage
      .from('work-images')
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: false
      })

    if (error) {
      console.error('アップロードエラー:', error)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from('work-images')
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error('画像アップロードエラー:', error)
    return null
  }
}

// 複数画像のアップロード
async function uploadMultipleImages(imagePaths, workId) {
  const imageUrls = []
  
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i].trim()
    if (!imagePath) continue
    
    const fileName = `${workId}_${i}_${path.basename(imagePath)}`
    const uploadedUrl = await uploadImage(imagePath, fileName)
    
    if (uploadedUrl) {
      imageUrls.push(uploadedUrl)
      console.log(`画像をアップロードしました: ${imagePath} -> ${uploadedUrl}`)
    }
  }
  
  return imageUrls
}

async function importCSVWithImages() {
  const csvFilePath = path.join(__dirname, '..', 'data', 'works.csv')
  const results = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // technologies を配列に変換
        const technologies = data.technologies.split(',').map(tech => tech.trim())
        
        // image_url を配列に変換（複数画像対応）
        const imageUrls = data.image_url ? data.image_url.split(',').map(url => url.trim()) : []
        
        results.push({
          title: data.title,
          description: data.description,
          year: parseInt(data.year),
          image_urls: imageUrls, // ローカルパスの配列
          project_url: data.project_url,
          github_url: data.github_url,
          technologies,
          category: data.category,
          featured: data.featured === 'true'
        })
      })
      .on('end', async () => {
        try {
          console.log(`${results.length} 件のデータを読み込みました`)
          
          // 各作品に対して画像をアップロードし、データを挿入
          for (const work of results) {
            // 一意のIDを生成
            const workId = `work_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
            
            // 画像をアップロード
            const uploadedImageUrls = await uploadMultipleImages(work.image_urls, workId)
            
            // サムネイルURLを設定（最初の画像）
            const thumbnailUrl = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null
            
            // 作品データを準備
            const workData = {
              title: work.title,
              description: work.description,
              year: work.year,
              thumbnail_url: thumbnailUrl,
              image_urls: uploadedImageUrls,
              project_url: work.project_url,
              github_url: work.github_url,
              technologies: work.technologies,
              category: work.category,
              featured: work.featured
            }
            
            // Supabase にデータを挿入
            const { data, error } = await supabase
              .from('works')
              .insert([workData])
              .select()

            if (error) {
              console.error('データ挿入エラー:', error)
            } else {
              console.log(`作品を登録しました: ${work.title}`)
            }
          }
          
          console.log('すべての作品の登録が完了しました')
          resolve()
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
  importCSVWithImages()
    .then(() => {
      console.log('CSVインポート（画像付き）が完了しました')
      process.exit(0)
    })
    .catch((err) => {
      console.error('CSVインポート（画像付き）が失敗しました:', err)
      process.exit(1)
    })
}

module.exports = { importCSVWithImages }