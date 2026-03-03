'use client'

import { useState, useMemo, useEffect } from 'react'
import { ReturnsHeader } from './ReturnsHeader'
import { ReturnsTable } from './ReturnsTable'
import { returnRequestService, type ReturnRequest } from '@/services/return-request.service'
import { LoadingSpinner } from '@/components/ui/loading'

export function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReturns = async () => {
    setIsLoading(true)
    try {
      const data = await returnRequestService.getAll()
      setReturns(data)
    } catch (error) {
      console.error('Error fetching return requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReturns()
  }, [])

  const filteredReturns = useMemo(() => {
    if (!searchQuery.trim()) return returns

    const query = searchQuery.toLowerCase().trim()

    return returns.filter((item) => {
      return (
        item.orderId.toString().includes(query) ||
        item.reason.toLowerCase().includes(query) ||
        item.createdByName.toLowerCase().includes(query) ||
        item.createdAt.includes(query)
      )
    })
  }, [searchQuery, returns])

  return (
    <div className="space-y-4">
      <ReturnsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ReturnsTable returns={filteredReturns} onRefresh={fetchReturns} />
      )}
    </div>
  )
}
