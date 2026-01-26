import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'px-4 py-6',

        fixed && 'flex grow flex-col overflow-hidden',

        !fluid &&
          'mx-auto w-full max-w-7xl 2xl:mx-auto 2xl:w-full 2xl:max-w-7xl',
        className
      )}
      {...props}
    />
  )
}
