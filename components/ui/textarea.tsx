import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div>
      <textarea
        ref={ref}
        className={cn(
          'input-base min-h-[100px] resize-y',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
