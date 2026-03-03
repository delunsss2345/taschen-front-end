'use server'

import { api } from '@/lib/api/fetchHandler'
import { ResponseApi } from '@/lib/api/responseHandler'
import { HttpStatusCode } from 'axios'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const { purchaseOrderId } = await params
    const body = await request.json()
    const { status } = body

    const response = await api.put<any>(
      `purchase-orders/${purchaseOrderId}/status`,
      { status }
    )

    return ResponseApi.success(response, HttpStatusCode.Ok)
  } catch (error) {
    console.error('Update status error:', error)
    return ResponseApi.error('Internal server error', HttpStatusCode.InternalServerError)
  }
}
