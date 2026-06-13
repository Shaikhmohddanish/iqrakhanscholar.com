import Link from "next/link"
import type { ReactNode } from "react"

const HIGHLIGHTS = [
  "Access your digital library anywhere, anytime",
  "Track your learning progress and bookmarks",
  "Book private consultations with Iqra",
  "Members-only reflections and resources",
]

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Brand panel */}
      <section className="bg-arabesque relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex lg:w-[45%]">
        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight">
          Iqra Khan
        </Link>

        <div className="max-w-md">
          <p className="font-heading text-3xl font-semibold leading-tight text-balance">
            Knowledge that nurtures the heart and elevates the soul.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-primary-foreground/85">
                <span
                  aria-hidden
                  className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                >
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/70">
          {"\u201C"}Seek knowledge from the cradle to the grave.{"\u201D"}
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-tight text-primary lg:hidden"
          >
            Iqra Khan
          </Link>
          <div className="mt-8 lg:mt-0">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground text-balance">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>
    </main>
  )
}
