import { readMultipartFormData } from 'h3'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cloudName = config.cloudinaryCloudName
  const apiKey = config.cloudinaryApiKey
  const apiSecret = config.cloudinaryApiSecret

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const filePart = parts.find(p => p.name === 'file')
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: 'File parameter is missing' })
  }

  // Convert buffer to base64 Data URL so Cloudinary accepts it
  const base64Data = filePart.data.toString('base64')
  const mimeType = filePart.type || 'image/jpeg'
  const fileDataUrl = `data:${mimeType};base64,${base64Data}`

  const timestamp = Math.round(new Date().getTime() / 1000)
  
  // Create signature
  const stringToSign = `timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

  // Prepare FormData for Cloudinary
  const formData = new FormData()
  formData.append('file', fileDataUrl)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json() as any
    if (data.error) {
      console.error('Cloudinary error:', data.error)
      throw createError({ statusCode: 500, statusMessage: data.error.message })
    }

    return {
      url: data.secure_url
    }
  } catch (err: any) {
    console.error('Upload error:', err)
    throw createError({ statusCode: 500, statusMessage: err.message || 'Failed to upload image' })
  }
})
