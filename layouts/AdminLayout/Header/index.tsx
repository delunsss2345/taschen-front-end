'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

type AdminHeaderProps = React.HTMLAttributes<HTMLElement> & {
  username?: string
}

export function Header({ className, username = 'admin', ...props }: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'h-16 w-full bg-white border-b border-gray-100 sticky top-0 z-10',
        className
      )}
      {...props}
    >
      <div className="h-full flex items-center px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-500 hover:bg-gray-50" />
          <div className="text-lg font-semibold text-[#F0592A]">SEBook Admin</div>
        </div>

        <div className="ms-auto flex items-center gap-3 text-sm">
          <div className="text-gray-500">
            Xin chào, <span className="text-gray-900 font-bold">{username}</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User className="h-5 w-5" />
            </div>
            <span className="text-gray-900 font-medium">{username}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
