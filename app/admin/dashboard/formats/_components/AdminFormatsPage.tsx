'use client'

import { useEffect, useState } from 'react'
import { FormatHeader } from './FormatHeader'
import { FormatTable } from './FormatTable'
import { formatService } from '@/services/format.service'
import type { Format } from '@/types/response/format.response'
import { toast } from 'sonner'

export function AdminFormatsPage() {
  const [formats, setFormats] = useState<Format[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFormats = async () => {
    try {
      setIsLoading(true)
      const data = await formatService.getAllFormats()
      setFormats(data)
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Không thể tải danh sách định dạng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFormats()
  }, [])

  const handleAddSuccess = () => {
    fetchFormats()
  }

  const handleEditSuccess = () => {
    fetchFormats()
  }

  const handleDeleteSuccess = () => {
    fetchFormats()
  }

  return (
    <div className="space-y-4">
      <FormatHeader onSuccess={handleAddSuccess} />
      <FormatTable 
        formats={formats} 
        isLoading={isLoading}
        onEditSuccess={handleEditSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
