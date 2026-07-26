"use client"

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react"
import { useRouter } from "next/navigation"
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  normaliseCurrency,
} from "@/lib/currency"

interface CurrencyContextValue {
  currency: string
  setCurrency: (code: string) => void
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [currency, setCurrencyState] = useState(() =>
    normaliseCurrency(initialCurrency),
  )

  const setCurrency = useCallback(
    (code: string) => {
      const next = normaliseCurrency(code)
      setCurrencyState(next)
      // Persist for a year; readable by both client and server.
      document.cookie = `${CURRENCY_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      // Re-render server components that price in the active currency in the
      // background so the switcher closes instantly instead of freezing the UI.
      startTransition(() => {
        router.refresh()
      })
    },
    [router],
  )

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  // Tolerate usage outside a provider (e.g. isolated previews) with a default.
  if (!ctx) return { currency: DEFAULT_CURRENCY, setCurrency: () => {} }
  return ctx
}
