'use server'

import { NextRequest } from 'next/server'
import { api } from '@/lib/api/fetchHandler'
import { getAuthorizationHeader, handleRouteError } from '@/app/api/_utils/route-utils'
import { ResponseApi } from '@/lib/api/responseHandler'
import { HttpStatusCode } from 'axios'
import { API_MESSAGE } from '@/constants/api/messageApi'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const { purchaseOrderId } = await params
    const headers = getAuthorizationHeader(request)
    const body = await request.json()

    const response = await api.post<{ data: unknown }>(
      `purchase-orders/${purchaseOrderId}/pay`,
      body,
      { headers }
    )

    return ResponseApi.success(response.data, HttpStatusCode.Ok)
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Pay Purchase Order API Error")
  }
}
