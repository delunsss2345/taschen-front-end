import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}
export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed w-full h-full peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex w-full h-full items-center gap-3 p-4 sm:gap-4',
        )}
      >
        <SidebarTrigger variant='outline' className='max-md:scale-125' />
        <Separator orientation='vertical' className='h-6' />
        {children}
      </div>
    </header>
  )
}
