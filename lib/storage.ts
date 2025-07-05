import { supabase } from './supabase'
import * as fs from 'fs'
import * as path from 'path'

export class SupabaseStorage {
  private bucketName = 'work-images'

  async uploadImage(filePath: string, fileName?: string): Promise<string | null> {
    try {
      // ファイルを読み込み
      const fileBuffer = fs.readFileSync(filePath)
      const fileExtension = path.extname(filePath)
      const finalFileName = fileName || `${Date.now()}_${path.basename(filePath)}`
      
      // Supabase Storage にアップロード
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(finalFileName, fileBuffer, {
          contentType: this.getContentType(fileExtension),
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return null
      }

      // パブリックURLを取得
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path)

      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  async uploadMultipleImages(imagePaths: string[], workId: string): Promise<string[]> {
    const uploadPromises = imagePaths.map(async (imagePath, index) => {
      const fileName = `${workId}_${index}_${path.basename(imagePath)}`
      return this.uploadImage(imagePath, fileName)
    })

    const results = await Promise.all(uploadPromises)
    return results.filter(url => url !== null) as string[]
  }

  async deleteImage(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fileName])

      return !error
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  }

  private getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream'
  }
}

export const storage = new SupabaseStorage()