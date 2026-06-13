import type { Metadata } from "next"
import Link from "next/link"
import { Settings, Globe, CreditCard, Mail, Image, CalendarClock, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false },
}

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "email", label: "Email", icon: Mail },
  { id: "cloudinary", label: "Cloudinary", icon: Image },
  { id: "booking", label: "Booking", icon: CalendarClock },
]

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const tab = params.tab ?? "general"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure site-wide settings and integrations.</p>
      </div>

      <nav className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <Link
              key={t.id}
              href={`?tab=${t.id}`}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-current={tab === t.id ? "page" : undefined}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          )
        })}
      </nav>

      <div className="max-w-2xl">
        {tab === "general" && <GeneralSettings />}
        {tab === "payment" && <PaymentSettings />}
        {tab === "email" && <EmailSettings />}
        {tab === "cloudinary" && <CloudinarySettings />}
        {tab === "booking" && <BookingSettings />}
      </div>
    </div>
  )
}

function SettingRow({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {children}
    </div>
  )
}

function EnvNote({ varName }: { varName: string }) {
  return (
    <p className="text-xs text-muted-foreground">Set via environment variable: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{varName}</code></p>
  )
}

function GeneralSettings() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-base font-semibold">General</h2>
      <SettingRow label="Site name">
        <input defaultValue="Iqra Khan" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </SettingRow>
      <SettingRow label="Site URL">
        <input defaultValue="https://iqrakhan.com" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </SettingRow>
      <SettingRow label="Contact email">
        <input defaultValue="hello@iqrakhan.com" type="email" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </SettingRow>
      <button className="h-9 w-fit rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save changes</button>
    </div>
  )
}

function PaymentSettings() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-base font-semibold">Razorpay</h2>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/15">
        <p className="text-sm text-amber-700 dark:text-amber-300">Payment is currently in mock mode. Configure Razorpay credentials to enable live payments.</p>
      </div>
      <SettingRow label="Razorpay Key ID">
        <input placeholder="rzp_live_…" type="password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="RAZORPAY_KEY_ID" />
      </SettingRow>
      <SettingRow label="Razorpay Key Secret">
        <input placeholder="••••••••" type="password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="RAZORPAY_KEY_SECRET" />
      </SettingRow>
    </div>
  )
}

function EmailSettings() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-base font-semibold">Email (Resend / SMTP)</h2>
      <SettingRow label="API Key">
        <input type="password" placeholder="re_…" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="RESEND_API_KEY" />
      </SettingRow>
      <SettingRow label="From address">
        <input defaultValue="hello@iqrakhan.com" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="EMAIL_FROM" />
      </SettingRow>
    </div>
  )
}

function CloudinarySettings() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-base font-semibold">Cloudinary</h2>
      <SettingRow label="Cloud Name">
        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="CLOUDINARY_CLOUD_NAME" />
      </SettingRow>
      <SettingRow label="API Key">
        <input type="password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="CLOUDINARY_API_KEY" />
      </SettingRow>
      <SettingRow label="API Secret">
        <input type="password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <EnvNote varName="CLOUDINARY_API_SECRET" />
      </SettingRow>
    </div>
  )
}

function BookingSettings() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-base font-semibold">Booking configuration</h2>
      <SettingRow label="Default session duration (minutes)" help="Used when no session type is specified.">
        <input type="number" defaultValue={60} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring w-32" />
      </SettingRow>
      <SettingRow label="Buffer between sessions (minutes)">
        <input type="number" defaultValue={15} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring w-32" />
      </SettingRow>
      <SettingRow label="Max bookings per day">
        <input type="number" defaultValue={6} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring w-32" />
      </SettingRow>
      <button className="h-9 w-fit rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save changes</button>
    </div>
  )
}
