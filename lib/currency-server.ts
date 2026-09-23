import "server-only"
import { cookies, headers } from "next/headers"
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  currencyForCountry,
  normaliseCurrency,
  isSupportedCurrency,
} from "./currency"

// Resolve the visitor's active currency for server components / server actions.
// Order of precedence: explicit cookie choice -> IP geo (Vercel edge header) ->
// site default. Always returns a supported currency code.
export async function getActiveCurrency(): Promise<string> {
  // Fast path, and the one that matters today: the store sells in INR only.
  // With a single supported currency there is nothing to resolve, and touching
  // cookies()/headers() would opt the calling page out of static rendering for
  // an answer that can never vary. Kept as a guard rather than hardcoded so
  // re-adding a currency restores the real resolution automatically.
  if (SUPPORTED_CURRENCIES.length === 1) return SUPPORTED_CURRENCIES[0].code

  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(CURRENCY_COOKIE)?.value
  if (isSupportedCurrency(fromCookie)) return fromCookie as string

  const headerStore = await headers()
  const country = headerStore.get("x-vercel-ip-country")
  // normaliseCurrency, because COUNTRY_TO_CURRENCY maps to currencies that are
  // not necessarily in SUPPORTED_CURRENCIES - without this a US visitor
  // resolved to "USD" and every downstream helper had to defend against it.
  if (country) return normaliseCurrency(currencyForCountry(country))

  return normaliseCurrency(fromCookie) || DEFAULT_CURRENCY
}
