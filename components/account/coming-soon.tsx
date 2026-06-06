import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export function ComingSoon({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </span>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}
