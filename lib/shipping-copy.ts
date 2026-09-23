// One source of truth for customer-facing shipping copy.
//
// These strings used to be hand-written in six places. They drifted: the
// product page promised "Free Shipping" in a trust badge while the same page's
// details section and the checkout both charged the flat rate. Deriving every
// label from SHIPPING_RATES / FREE_SHIPPING_THRESHOLDS means a rate change can
// no longer leave stale promises behind, and nothing can claim a discount the
// checkout doesn't honour.

import {
  DEFAULT_CURRENCY,
  FREE_SHIPPING_THRESHOLDS,
  SHIPPING_RATES,
} from "./currency"
import { formatPrice } from "./product-types"

// e.g. "₹99"
export function shippingRateLabel(currency: string = DEFAULT_CURRENCY): string {
  const rate = SHIPPING_RATES[currency] ?? SHIPPING_RATES[DEFAULT_CURRENCY]
  return formatPrice(rate, currency)
}

// e.g. "₹999", or null when this currency has no free-shipping threshold.
export function freeShippingLabel(
  currency: string = DEFAULT_CURRENCY,
): string | null {
  const threshold = FREE_SHIPPING_THRESHOLDS[currency]
  if (threshold == null) return null
  return formatPrice(threshold, currency)
}

// Short headline for strips and badges, e.g. "Free shipping over ₹999".
export function shippingHeadline(currency: string = DEFAULT_CURRENCY): string {
  const free = freeShippingLabel(currency)
  return free
    ? `Free shipping over ${free}`
    : `Flat ${shippingRateLabel(currency)} shipping`
}

// Full sentence for product pages and policy blurbs.
export function shippingDetail(currency: string = DEFAULT_CURRENCY): string {
  const free = freeShippingLabel(currency)
  const rate = shippingRateLabel(currency)
  return free
    ? `${rate} flat rate on orders with physical items, free over ${free}. Calculated at checkout.`
    : `${rate} flat rate on orders with physical items, calculated at checkout.`
}
