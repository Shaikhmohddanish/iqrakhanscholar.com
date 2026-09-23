import { SmartHeader } from './smart-header'

/**
 * Site header for public pages.
 *
 * Deliberately does NOT read the session. It used to call getCurrentUser(),
 * which reads cookies - and because almost every page renders this component,
 * that single call opted the whole public site out of static rendering. Even
 * /terms and /privacy, which have no data of their own, were server-rendered
 * per request.
 *
 * SmartHeader now resolves the session itself from /api/auth/me after mount.
 * Pages that are dynamic anyway and already have the user in hand (e.g.
 * app/account/layout.tsx) should keep passing it to SmartHeader directly, which
 * skips the fetch and renders the signed-in state immediately.
 */
export function SiteHeader() {
  return <SmartHeader />
}
