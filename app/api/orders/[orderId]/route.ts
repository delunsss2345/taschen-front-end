import { NextRequest } from 'next/server'
import { api } from '@/lib/api/fetchHandler'
import { getAuthorizationHeader } from '@/app/api/_utils/route-utils'
import { ResponseApi } from '@/lib/api/responseHandler'
import { HttpStatusCode } from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const headers = getAuthorizationHeader(request)
    const response = await api.get(`/api/orders/${orderId}`, { headers })
    return ResponseApi.success(response, HttpStatusCode.Ok)
  } catch (error) {
    console.error('Order API Error:', error)
    return ResponseApi.error('Failed to fetch order', HttpStatusCode.InternalServerError)
  }
}
