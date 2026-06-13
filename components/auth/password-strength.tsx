"use client"

interface PasswordStrengthProps {
  password: string
}

function getStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: "", color: "" }
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const capped = Math.min(score, 4)
  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"]
  return { score: capped, label: labels[capped] ?? "", color: colors[capped] ?? "" }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getStrength(password)
  if (!password) return null

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? color : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="font-medium text-foreground">{label}</span>
        {score < 3 && " — use uppercase, numbers, and symbols to strengthen."}
      </p>
    </div>
  )
}
