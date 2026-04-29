'use client'

import { useEffect } from 'react'

export default function FontProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--font-sans', "'Helvetica Neue', Helvetica, Arial, sans-serif")
    root.style.setProperty('--font-serif', "'Helvetica Neue', Helvetica, Arial, serif")
  }, [])

  return <div>{children}</div>
}
