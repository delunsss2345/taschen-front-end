'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import type { Account } from './AccountTable'

interface ViewAddressesDialogProps {
  trigger: React.ReactNode
  account: Account
}

export function ViewAddressesDialog({ trigger, account }: ViewAddressesDialogProps) {
  const [open, setOpen] = useState(false)
  const addresses = account.addresses || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Địa chỉ của: {account.fullName}</DialogTitle>
        </DialogHeader>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Người dùng chưa có địa chỉ nào
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <TableHeaderCell>Loại</TableHeaderCell>
                <TableHeaderCell>Người nhận</TableHeaderCell>
                <TableHeaderCell>Địa chỉ</TableHeaderCell>
                <TableHeaderCell>Điện thoại</TableHeaderCell>
                <TableHeaderCell>Mặc định</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {addresses.map((addr) => (
                <TableRow key={addr.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {addr.addressType === 'HOME' ? 'Nhà riêng' : addr.addressType === 'OFFICE' ? 'Văn phòng' : addr.addressType}
                    </Badge>
                  </TableCell>
                  <TableCell>{addr.recipientName}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </div>
                  </TableCell>
                  <TableCell>{addr.phoneNumber}</TableCell>
                  <TableCell>
                    {addr.isDefault && (
                      <Badge className="bg-green-100 text-green-700 border-none shadow-none">
                        Mặc định
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        )}
      </DialogContent>
    </Dialog>
  )
}
