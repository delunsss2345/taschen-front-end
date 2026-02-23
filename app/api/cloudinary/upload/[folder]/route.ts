import { NextRequest } from 'next/server'
import { envConfig } from '@/config/envConfig'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  try {
    const { folder } = await params

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const backendUrl = `${envConfig.BACKEND_API_URL}cloudinary/upload/${folder}`
    const authHeader = request.headers.get("authorization")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const backendFormData = new FormData()
    backendFormData.append('file', new Blob([buffer], { type: file.type || 'image/jpeg' }), file.name)
    backendFormData.append('folder', folder)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: authHeader ? { 'Authorization': authHeader } : undefined,
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
    const secureUrl = data?.data?.secure_url || data?.secure_url

    return Response.json({
      success: true,
      data: {
        url: secureUrl,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
