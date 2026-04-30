'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth'
import { NotificationBell } from '@/features/notifications/NotificationBell'
import { Home, User, UserPen } from 'lucide-react'
import Link from 'next/link'

type AdminHeaderProps = React.HTMLAttributes<HTMLElement>

export function Header({ className, ...props }: AdminHeaderProps) {
  const { currentUser } = useAuthStore()

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : 'Admin'

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
          <div className="font-serif text-lg font-semibold text-[#030303]">TASCHEN</div>
        </div>

        <div className="ms-auto flex items-center gap-3 text-sm">
          <div className="text-gray-500">
            Xin chào, <span className="text-gray-900 font-bold">{displayName}</span>
          </div>

          <NotificationBell />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="h-5 w-5" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 font-sans">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                {currentUser?.email && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <UserPen className="h-4 w-4 text-gray-500" />
                  Chỉnh sửa thông tin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                  <Home className="h-4 w-4 text-gray-500" />
                  Trang chủ
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
