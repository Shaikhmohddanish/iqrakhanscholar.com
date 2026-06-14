import { getCurrentUser } from '@/lib/session'
import { SmartHeader } from './smart-header'

/**
 * Server component wrapper - reads the current user from cookies and
 * passes it to the client-side SmartHeader. Use this in layouts/pages
 * instead of importing SmartHeader directly.
 */
export async function SiteHeader() {
  const user = await getCurrentUser()
  return <SmartHeader user={user} />
}
