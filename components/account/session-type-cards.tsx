"use client"

import { SESSION_TYPES, type SessionType } from "@/lib/booking-types"
import { formatPrice } from "@/lib/product-types"
import { CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionTypeCardsProps {
  selected: SessionType | null
  onSelect: (type: SessionType) => void
}

export function SessionTypeCards({ selected, onSelect }: SessionTypeCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SESSION_TYPES.map((session) => {
        const isSelected = selected === session.id
        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelect(session.id)}
            className={cn(
              "flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading text-base font-semibold text-foreground">
                {session.title}
              </h3>
              {isSelected && <CheckCircle2 className="size-5 shrink-0 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">{session.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                {session.duration} min
              </span>
              <span className="font-semibold text-foreground">
                {session.price === 0 ? "Free" : formatPrice(session.price, session.currency)}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
