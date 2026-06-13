import { cn } from '@/lib/utils'

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  processing: {
    label: 'Processing',
    className: 'bg-info/10 text-info border-info/20',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success border-success/20',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-info/10 text-info border-info/20',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-muted text-muted-foreground border-border',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground border-border',
  },
  published: {
    label: 'Published',
    className: 'bg-success/10 text-success border-success/20',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
} as const

export type StatusType = keyof typeof statusConfig

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {label || config.label}
    </span>
  )
}
