"use client"

import { useRef } from "react"

interface OtpInputProps {
  length?: number
  value: string[]
  onChange: (value: string[]) => void
}

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1)
    const newVal = [...value]
    newVal[index] = digit
    onChange(newVal)
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputs.current[index - 1]?.focus()
      }
      const newVal = [...value]
      newVal[index] = ""
      onChange(newVal)
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    const newVal = Array(length).fill("")
    for (let i = 0; i < pasted.length; i++) newVal[i] = pasted[i]
    onChange(newVal)
    const nextEmpty = Math.min(pasted.length, length - 1)
    inputs.current[nextEmpty]?.focus()
  }

  return (
    <div className="flex gap-2" role="group" aria-label="One-time password">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          aria-label={`Digit ${i + 1}`}
          className="flex size-12 items-center justify-center rounded-lg border border-border bg-background text-center text-lg font-bold text-foreground caret-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ))}
    </div>
  )
}
