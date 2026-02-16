'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportRequests() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/dashboard/import-requests/pending')
  }, [router])

  return null
}
