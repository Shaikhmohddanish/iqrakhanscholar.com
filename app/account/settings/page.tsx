import type { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { getAddresses, findUserById } from "@/lib/users"
import { ProfileForm } from "@/components/account/profile-form"
import { AddressManager } from "@/components/account/address-form"
import { SecuritySettings } from "@/components/account/security-settings"
import { DataPrivacySection } from "@/components/account/data-privacy-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, ShieldCheck, Lock } from "lucide-react"
import { PageHeading } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "privacy", label: "Privacy & Data", icon: Lock },
]

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])
  if (!user) return null

  const activeTab = params.tab ?? "profile"
  const addresses = activeTab === "addresses" ? await getAddresses(user.id) : []
  // Whether the account has a password set (Google-only accounts don't), so the
  // Security tab can show "Set a password" instead of "Change password".
  const hasPassword =
    activeTab === "security" ? Boolean((await findUserById(user.id))?.passwordHash) : true

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Settings"
        description="Manage your profile, addresses, security, and data privacy."
      />

      {/* Tab navigation */}
      <nav className="flex flex-wrap gap-1 rounded-xl bg-muted p-1" aria-label="Settings tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {/* Tab content */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Profile information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      )}

      {activeTab === "addresses" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Saved addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressManager addresses={addresses} />
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Security</CardTitle>
          </CardHeader>
          <CardContent>
            <SecuritySettings hasPassword={hasPassword} />
          </CardContent>
        </Card>
      )}

      {activeTab === "privacy" && (
        <div>
          <DataPrivacySection />
        </div>
      )}
    </div>
  )
}
