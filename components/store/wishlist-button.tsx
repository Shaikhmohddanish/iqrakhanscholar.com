'use client'

import { Heart } from 'lucide-react'
import { BarLoader } from '@/components/ui/bar-loader'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toggleWishlistAction } from '@/app/actions/wishlist'
import { useWishlist } from '@/components/store/wishlist-provider'

interface WishlistButtonProps {
  productId: string
  /**
   * Explicit initial state. Omit it on pages that render statically - the
   * button then reads from WishlistProvider, which resolves the wishlist in
   * the browser so the page itself never has to touch the session cookie.
   */
  initialWishlisted?: boolean
  size?: 'sm' | 'md'
  variant?: 'icon' | 'overlay'
  className?: string
}

export function WishlistButton({
  productId,
  initialWishlisted,
  size = 'md',
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const { isWishlisted, loaded } = useWishlist()
  const [override, setOverride] = useState<boolean | null>(
    initialWishlisted ?? null,
  )
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // The user's own toggle wins; otherwise fall back to whatever the provider
  // has loaded (false until it resolves, which is the signed-out default).
  const wishlisted = override ?? (loaded ? isWishlisted(productId) : false)
  const setWishlisted = (fn: (prev: boolean) => boolean) =>
    setOverride((prev) => fn(prev ?? (loaded ? isWishlisted(productId) : false)))

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    // Optimistic update
    setWishlisted((prev) => !prev)
    startTransition(async () => {
      const result = await toggleWishlistAction(productId)
      if ('error' in result && result.error) {
        // Revert optimistic update and redirect to login if not signed in
        setWishlisted((prev) => !prev)
        router.push('/login?next=/store')
      }
    })
  }

  const sizeClass = size === 'sm' ? 'size-8' : 'size-10'
  const iconSize = size === 'sm' ? 'size-4' : 'size-5'

  const sharedClass = cn(
    'flex items-center justify-center transition-all',
    sizeClass,
    className,
  )

  const icon = pending ? (
    <BarLoader size={size === 'sm' ? 'sm' : 'md'} className="text-muted-foreground" />
  ) : (
    <Heart
      className={cn(
        iconSize,
        'transition-colors',
        wishlisted ? 'fill-destructive text-destructive' : variant === 'overlay' ? 'text-foreground' : 'text-muted-foreground',
      )}
    />
  )

  if (variant === 'overlay') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={cn(sharedClass, 'rounded-full bg-card/90 backdrop-blur hover:scale-110 disabled:opacity-60')}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
      >
        {icon}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={cn(sharedClass, 'rounded-lg border border-border hover:bg-muted disabled:opacity-60')}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
    >
      {icon}
    </button>
  )
}
