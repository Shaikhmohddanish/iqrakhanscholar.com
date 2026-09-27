'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Loads the signed-in visitor's wishlist once, in the browser, and shares it
 * with every WishlistButton on the page.
 *
 * The store pages used to resolve this server-side, which meant reading the
 * session cookie and so rendering /store, /store/abayas and /store/accessories
 * on demand for every visitor. One fetch after hydration is a far better trade
 * than making the whole catalogue uncacheable, and a heart icon filling in a
 * moment late is not something a logged-out visitor ever sees.
 */
const WishlistContext = createContext<{
  isWishlisted: (productId: string) => boolean
  loaded: boolean
}>({ isWishlisted: () => false, loaded: false })

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/wishlist', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { productIds: [] }))
      .then((data) => {
        if (cancelled) return
        setIds(new Set<string>(data?.productIds ?? []))
        setLoaded(true)
      })
      // On failure every heart just stays unfilled, which is the correct
      // default for a signed-out visitor anyway.
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ isWishlisted: (productId: string) => ids.has(productId), loaded }),
    [ids, loaded],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}
