'use client'

import dynamic from 'next/dynamic'

const OverviewChart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full animate-pulse rounded-md bg-muted" />
  ),
})

export function Overview() {
  return <OverviewChart />
}
