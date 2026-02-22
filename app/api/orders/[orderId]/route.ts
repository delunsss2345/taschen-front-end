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
    
    const allOrdersResponse = await api.get<{ data: unknown }>('/api/orders', { headers })
    const ordersData = allOrdersResponse.data
    
    let ordersArray: unknown[] = []
    if (Array.isArray(ordersData)) {
      ordersArray = ordersData
    } else if (ordersData && typeof ordersData === 'object' && 'result' in ordersData) {
      ordersArray = (ordersData as { result: unknown[] }).result
    }
    
    const order = ordersArray.find((o: unknown) => {
      const obj = o as { id?: number }
      return obj.id === Number(orderId)
    })
    
    if (!order) {
      return ResponseApi.error('Order not found', HttpStatusCode.NotFound)
    }
    
    return ResponseApi.success(order, HttpStatusCode.Ok)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return ResponseApi.error(`Failed to fetch order: ${message}`, HttpStatusCode.InternalServerError)
  }
}
