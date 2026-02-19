import { NextRequest } from 'next/server'
import { envConfig } from '@/config/envConfig'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params

  // Parse form data
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return Response.json(
      { success: false, error: 'No file provided' },
      { status: 400 }
    )
  }

  const backendUrl = `${envConfig.BACKEND_API_URL}/api/cloudinary/upload/${folder}`

  // Convert File to Buffer and send as multipart
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create form data for backend
  const backendFormData = new FormData()
  backendFormData.append('file', new Blob([buffer], { type: file.type || 'image/jpeg' }), file.name)
  backendFormData.append('folder', folder)

  const response = await fetch(backendUrl, {
    method: 'POST',
    body: backendFormData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    return Response.json(
      { success: false, error: errorText },
      { status: response.status }
    )
  }

  const data = await response.json()

  // Backend returns { error, message, statusCode, data: { secure_url, ... } }
  const secureUrl = data?.data?.secure_url || data?.secure_url

  return Response.json({
    success: true,
    data: {
      url: secureUrl,
    },
  })
}
