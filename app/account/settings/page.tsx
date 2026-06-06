import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { PageHeading } from "@/components/account/coming-soon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
}

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const rows = [
    { label: "Full name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Account type", value: user.role, capitalize: true },
  ]

  return (
    <div>
      <PageHeading
        title="Settings"
        description="Manage your profile information and account preferences."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0 divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className={"text-sm font-medium text-foreground" + (row.capitalize ? " capitalize" : "")}>
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <span className="text-sm text-muted-foreground">Email status</span>
            {user.emailVerified ? (
              <Badge variant="secondary" className="gap-1">
                <CircleCheck className="size-3.5" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-accent/50 text-accent-foreground">
                <CircleAlert className="size-3.5" /> Unverified
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
