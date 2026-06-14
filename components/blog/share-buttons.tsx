'use client'

import { useState } from 'react'
import { MessageCircle, Link as LinkIcon, Check, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url?: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable - silently ignore
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>

      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Share2 className="size-4" />
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MessageCircle className="size-4" />
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
