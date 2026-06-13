import { Lock, BookOpen, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookAccessBadgeProps {
  status: 'owned' | 'preview' | 'locked'
  className?: string
}

const statusConfig = {
  owned: {
    icon: BookOpen,
    label: 'Purchased',
    className: 'bg-success/10 text-success border-success/20',
  },
  preview: {
    icon: Eye,
    label: 'Preview Only',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  locked: {
    icon: Lock,
    label: 'Locked',
    className: 'bg-muted text-muted-foreground border-border',
  },
}

export function BookAccessBadge({ status, className }: BookAccessBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}
