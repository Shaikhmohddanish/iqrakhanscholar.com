'use client'

import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
            value === option.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-muted/50',
          )}
        >
          <div className="relative mt-0.5 flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <div
              className={cn(
                'size-5 rounded-full border-2 transition-colors',
                value === option.value ? 'border-primary' : 'border-border',
              )}
            >
              {value === option.value && (
                <div className="m-[3px] size-[10px] rounded-full bg-primary" />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}
