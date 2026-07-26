import "server-only"
import { cookies, headers } from "next/headers"
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  currencyForCountry,
  normaliseCurrency,
  isSupportedCurrency,
} from "./currency"

// Resolve the visitor's active currency for server components / server actions.
// Order of precedence: explicit cookie choice -> IP geo (Vercel edge header) ->
// site default. Always returns a supported currency code.
export async function getActiveCurrency(): Promise<string> {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(CURRENCY_COOKIE)?.value
  if (isSupportedCurrency(fromCookie)) return fromCookie as string

  const headerStore = await headers()
  const country = headerStore.get("x-vercel-ip-country")
  if (country) return currencyForCountry(country)

  return normaliseCurrency(fromCookie) || DEFAULT_CURRENCY
}
