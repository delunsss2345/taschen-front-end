'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type ComboboxValue = string | number

export type ComboboxOption<TValue extends ComboboxValue = ComboboxValue> = {
  value: TValue
  label: string
}

type MultiSelectComboboxProps<TValue extends ComboboxValue = ComboboxValue> = {
  options: ComboboxOption<TValue>[]
  value: TValue[]
  onChange: (value: TValue[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

export function MultiSelectCombobox<TValue extends ComboboxValue = ComboboxValue>({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không có dữ liệu',
}: MultiSelectComboboxProps<TValue>) {
  const [open, setOpen] = useState(false)

  const selectedOptions = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o]))
    return value.map((v) => map.get(v)).filter(Boolean) as ComboboxOption<TValue>[]
  }, [options, value])

  const toggle = (v: TValue) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v))
    else onChange([...value, v])
  }

  const remove = (v: TValue) => {
    onChange(value.filter((x) => x !== v))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between cursor-pointer"
          >
            <span className={cn('truncate', value.length === 0 && 'text-muted-foreground')}>
              {value.length === 0 ? placeholder : `Đã chọn: ${selectedOptions.length}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = value.includes(opt.value)
                  return (
                    <CommandItem
                      key={String(opt.value)}
                      value={opt.label}
                      onSelect={() => toggle(opt.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      {opt.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <Badge key={String(opt.value)} variant="secondary" className="gap-1">
              {opt.label}
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => remove(opt.value)}
                aria-label={`Bỏ ${opt.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
