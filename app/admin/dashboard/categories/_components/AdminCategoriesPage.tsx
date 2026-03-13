'use client'

import { useEffect } from 'react'
import { CategoryHeader } from './CategoryHeader'
import { CategoryTable } from './CategoryTable'
import { useCategories } from '@/features/category/hooks'
import { toast } from 'sonner'

export function AdminCategoriesPage() {
  const { data: categories = [], isPending, isError, refetch } = useCategories()

  useEffect(() => {
    if (isError) {
      toast.error('Không thể tải danh sách thể loại')
    }
  }, [isError])

  return (
    <div className="space-y-4">
      <CategoryHeader onSuccess={refetch} />
      <CategoryTable 
        categories={categories} 
        isLoading={isPending}
        onEditSuccess={refetch}
        onDeleteSuccess={refetch}
      />
    </div>
  )
}
