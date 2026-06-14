"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarLoader } from "@/components/ui/bar-loader"
import { CircleAlert, CircleCheck } from "lucide-react"

export function SubmitButton({
  children,
  disabled,
  loading,
  pendingLabel,
}: {
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()
  const busy = pending || loading
  return (
    <Button type="submit" className="w-full" size="lg" disabled={busy || disabled}>
      {busy ? <BarLoader size="md" /> : null}
      {busy && pendingLabel ? pendingLabel : children}
    </Button>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm text-destructive">{message}</p>
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <Alert variant="destructive" className="mb-5">
      <CircleAlert className="size-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function FormSuccess({ message, devLink }: { message?: string; devLink?: string }) {
  if (!message) return null
  return (
    <Alert className="mb-5 border-primary/30 bg-secondary text-secondary-foreground">
      <CircleCheck className="size-4" />
      <AlertDescription className="text-secondary-foreground">
        <span>{message}</span>
        {devLink ? (
          <a
            href={devLink}
            className="mt-2 block break-all font-medium text-primary underline underline-offset-2"
          >
            Dev link: {devLink}
          </a>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}
