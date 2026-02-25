'use server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ purchaseOrderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Chưa xác thực', message: 'Unauthorized', statusCode: 401 },
        { status: 401 }
      )
    }

    const { purchaseOrderId } = await params
    const body = await request.json()
    const { status } = body

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: Number(purchaseOrderId) },
    })

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn đặt hàng', message: 'Purchase order not found', statusCode: 404 },
        { status: 404 }
      )
    }

    const updatedPurchaseOrder = await prisma.purchaseOrder.update({
      where: { id: Number(purchaseOrderId) },
      data: { status },
      include: {
        supplier: true,
        createdBy: true,
        approvedBy: true,
      },
    })

    return NextResponse.json({
      error: null,
      message: 'Cập nhật trạng thái thành công',
      statusCode: 200,
      data: updatedPurchaseOrder,
    })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { error: 'Lỗi server', message: 'Internal server error', statusCode: 500 },
      { status: 500 }
    )
  }
}
