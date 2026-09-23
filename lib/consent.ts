// Cookie-consent state, shared by the banner that collects it and the scripts
// that must honour it.
//
// The banner used to store the visitor's choice and nothing read it back, so
// "Reject Non-Essential" still loaded the AdSense marketing script. Anything
// that drops a non-essential cookie must gate on hasConsent() and subscribe to
// onConsentChange() so a choice takes effect without a reload.

export const CONSENT_KEY = "ik-cookie-consent"
export const CONSENT_COOKIE = "cookie-consent"

// Fired on window when the visitor saves a choice.
export const CONSENT_EVENT = "ik-consent-change"

export interface ConsentChoice {
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export type ConsentCategory = "analytics" | "marketing"

// Read the stored choice, or null if the visitor hasn't chosen yet. Safe to
// call during SSR and in private windows where localStorage throws.
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentChoice
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

// Whether the visitor has actively allowed a category. Defaults to false: no
// choice yet means no consent, which is the behaviour GDPR requires.
export function hasConsent(category: ConsentCategory): boolean {
  return readConsent()?.[category] === true
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
  } catch {
    // Private window or blocked storage - the cookie below still carries it.
  }
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
      JSON.stringify(choice),
    )};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
}

// Subscribe to consent changes. Returns an unsubscribe function.
export function onConsentChange(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(CONSENT_EVENT, fn)
  return () => window.removeEventListener(CONSENT_EVENT, fn)
}
