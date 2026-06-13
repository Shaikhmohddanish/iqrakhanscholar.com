import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepperProps {
  steps: { label: string; description?: string }[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming'

          return (
            <li key={step.label} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    status === 'complete' && 'border-primary bg-primary text-primary-foreground',
                    status === 'current' && 'border-primary bg-primary/10 text-primary',
                    status === 'upcoming' && 'border-border bg-card text-muted-foreground',
                  )}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'complete' ? <Check className="size-5" /> : i + 1}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'mt-2 text-center text-xs font-medium',
                    status === 'current' ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="mt-0.5 text-center text-[10px] text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="mx-3 mb-8 h-0.5 flex-1">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors',
                      i < currentStep ? 'bg-primary' : 'bg-border',
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
