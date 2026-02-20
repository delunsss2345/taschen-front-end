'use client'

import { useEffect, useState } from 'react'
import { CategoryHeader } from './CategoryHeader'
import { CategoryTable } from './CategoryTable'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/types/response/category.response'
import { toast } from 'sonner'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Không thể tải danh sách thể loại')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddSuccess = () => {
    fetchCategories()
  }

  const handleEditSuccess = () => {
    fetchCategories()
  }

  const handleDeleteSuccess = () => {
    fetchCategories()
  }

  return (
    <div className="space-y-4">
      <CategoryHeader onSuccess={handleAddSuccess} />
      <CategoryTable 
        categories={categories} 
        isLoading={isLoading}
        onEditSuccess={handleEditSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
