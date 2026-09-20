// Client-safe currency config & helpers (no server-only imports), so both
// server components and client components can share one source of truth.
//
// All monetary amounts are stored as integers in the currency's *minor units*
// (e.g. cents for USD, pence for GBP, fils for KWD). Use currencyDecimals() to
// convert to/from major units for display.

export interface CurrencyInfo {
  code: string
  symbol: string
  label: string
  // ISO 4217 minor-unit exponent: 2 for USD/EUR, 0 for JPY, 3 for KWD.
  decimals: number
}

export const DEFAULT_CURRENCY = "INR"

// Cookie that persists the visitor's selected currency. Not httpOnly so the
// client switcher can read/write it; server code reads it via next/headers.
export const CURRENCY_COOKIE = "ik_currency"

// The store sells in INR only. Everything is priced, charged and shipped in
// rupees, so there is no switcher and no FX conversion (there never was any -
// multi-currency only ever worked via manually entered per-currency overrides,
// which no product had, so non-INR visitors saw raw USD base prices while
// shipping was quoted in rupees).
//
// Anything already stored in another currency (historical orders, bookings)
// keeps rendering in its own currency: every record stores its own code and
// formatPrice accepts any ISO code, regardless of this list.
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", decimals: 2 },
]

const CURRENCY_BY_CODE: Record<string, CurrencyInfo> = Object.fromEntries(
  SUPPORTED_CURRENCIES.map((c) => [c.code, c]),
)

export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return CURRENCY_BY_CODE[code]
}

export function isSupportedCurrency(code: string | null | undefined): boolean {
  return !!code && code in CURRENCY_BY_CODE
}

// Minor-unit exponent for a currency; defaults to 2 for unknown codes.
export function currencyDecimals(code: string): number {
  return CURRENCY_BY_CODE[code]?.decimals ?? 2
}

// Convert a major-unit amount (e.g. 14.5) to integer minor units, and back.
export function toMinorUnits(amount: number, currency: string): number {
  return Math.round(amount * 10 ** currencyDecimals(currency))
}

export function fromMinorUnits(minor: number, currency: string): number {
  return minor / 10 ** currencyDecimals(currency)
}

// Normalise an arbitrary code to a supported one, falling back to the default.
export function normaliseCurrency(code: string | null | undefined): string {
  return isSupportedCurrency(code) ? (code as string) : DEFAULT_CURRENCY
}

// ISO-3166 alpha-2 country code -> currency code. Only countries whose currency
// the store supports are listed; everything else falls back to DEFAULT_CURRENCY.
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  PK: "PKR",
  AE: "AED",
  SA: "SAR",
  CA: "CAD",
  AU: "AUD",
  MY: "MYR",
  JP: "JPY",
  KW: "KWD",
  // Eurozone
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", AT: "EUR",
  IE: "EUR", PT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR", SK: "EUR", SI: "EUR",
  EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR", HR: "EUR",
}

// Resolve a visitor's country (ISO alpha-2) to a supported currency.
export function currencyForCountry(country: string | null | undefined): string {
  if (!country) return DEFAULT_CURRENCY
  return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? DEFAULT_CURRENCY
}

// Anything with a base price/currency and an optional per-currency override map.
// Products, books, cart items and session tiers all satisfy this shape.
export interface PricedLike {
  // base amount in minor units of `currency`
  price: number
  // base currency code (the required fallback)
  currency: string
  // optional manually-entered amounts keyed by currency code (minor units)
  prices?: Record<string, number>
}

// Pick the amount + currency to charge/display for a target currency. Returns
// the local price when set, otherwise the base price in the base currency.
export function resolveProductPrice(
  item: PricedLike,
  currency: string,
): { amount: number; currency: string } {
  const local = item.prices?.[currency]
  if (local != null) return { amount: local, currency }
  return { amount: item.price, currency: item.currency }
}

// Exact amount for a currency in minor units, or null if the item carries no
// price in it (neither an explicit override nor a matching base currency).
export function priceInCurrency(item: PricedLike, currency: string): number | null {
  if (item.prices?.[currency] != null) return item.prices[currency]
  if (item.currency === currency) return item.price
  return null
}

// Choose a single currency for a whole cart so line items never mix currencies:
// the visitor's active currency when every item is priced in it, otherwise the
// default currency (the guaranteed base every product carries).
export function resolveCartCurrency(items: PricedLike[], active: string): string {
  if (items.length === 0) return active
  if (items.every((i) => priceInCurrency(i, active) != null)) return active
  return DEFAULT_CURRENCY
}

// Amount to charge for a cart line in the chosen cart currency, with a final
// fallback to the item's base price if it somehow isn't priced in it.
export function cartLineAmount(item: PricedLike, currency: string): number {
  return priceInCurrency(item, currency) ?? item.price
}

// Flat-rate shipping per currency (minor units), applied when a cart contains a
// physical item. Falls back to the USD rate for unconfigured currencies.
export const SHIPPING_RATES: Record<string, number> = {
  USD: 599,
  EUR: 549,
  GBP: 499,
  INR: 9900,
  PKR: 50000,
  AED: 2200,
  SAR: 2200,
  CAD: 799,
  AUD: 899,
  MYR: 2500,
  JPY: 900,
  KWD: 1800,
}

export function shippingForCurrency(currency: string): number {
  return SHIPPING_RATES[currency] ?? SHIPPING_RATES[DEFAULT_CURRENCY]
}
