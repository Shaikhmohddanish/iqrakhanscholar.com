'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'icon' | 'labeled'
}

export function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — render nothing until client mounts
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full',
          className,
        )}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  function toggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          className,
        )}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  )
}
