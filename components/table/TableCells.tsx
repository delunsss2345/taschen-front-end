'use client'

import { cn } from '@/lib/utils'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'highlight'
  children: React.ReactNode
}

export function TableCell({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: TableCellProps) {
  const variantStyles = {
    default: 'text-gray-900',
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    highlight: 'text-red-500',
  }

  const baseClasses = 'px-6 py-5 font-medium'

  return (
    <td 
      className={cn(baseClasses, variantStyles[variant], className)} 
      {...props}
    >
      {children}
    </td>
  )
}

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode
}

export function TableHeaderCell({ 
  className, 
  children, 
  ...props 
}: TableHeaderCellProps) {
  return (
    <th 
      className={cn('px-6 py-4 font-semibold text-gray-500', className)} 
      {...props}
    >
      {children}
    </th>
  )
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export function TableRow({ 
  className, 
  children, 
  ...props 
}: TableRowProps) {
  return (
    <tr 
      className={cn('hover:bg-gray-50 transition-colors', className)} 
      {...props}
    >
      {children}
    </tr>
  )
}
