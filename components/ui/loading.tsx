'use client'

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  text?: string
}

export function LoadingSpinner({ className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      {text && <span className="text-gray-500">{text}</span>}
    </div>
  )
}
