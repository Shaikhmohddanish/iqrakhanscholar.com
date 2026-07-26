import "server-only"
import DOMPurify from "isomorphic-dompurify"

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

// Allowlist for admin-authored article HTML. Anything outside this is stripped,
// so stored content cannot inject scripts/iframes/handlers onto a public,
// indexed, ad-monetized page.
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "strong", "em", "b", "i", "u", "s", "mark", "sup", "sub",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
]
const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "id", "class",
  "target", "rel", "width", "height", "colspan", "rowspan",
]

// Force safe rel/target on external links (security + SEO).
DOMPurify.addHook("afterSanitizeAttributes", (node: unknown) => {
  const el = node as {
    tagName?: string
    getAttribute?: (n: string) => string | null
    setAttribute?: (n: string, v: string) => void
  }
  if (el.tagName === "A" && el.getAttribute && el.setAttribute) {
    const href = el.getAttribute("href") ?? ""
    if (/^https?:\/\//i.test(href)) {
      el.setAttribute("target", "_blank")
      el.setAttribute("rel", "noopener noreferrer nofollow")
    }
  }
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Sanitizes stored article HTML, injects stable ids onto h2/h3 headings (for
 * the table of contents + anchor links), and returns a word count for JSON-LD.
 */
export function processArticleContent(raw: string): {
  html: string
  headings: ArticleHeading[]
  wordCount: number
} {
  if (!raw) return { html: "", headings: [], wordCount: 0 }

  const clean = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
  })

  const headings: ArticleHeading[] = []
  const usedIds = new Set<string>()

  const html = clean.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const level = tag.toLowerCase() === "h2" ? 2 : 3
      const text = inner.replace(/<[^>]+>/g, "").trim()
      if (!text) return match

      const existing = /id=["']([^"']+)["']/i.exec(attrs)
      const base = (existing ? existing[1] : slugify(text)) || `section-${headings.length + 1}`
      let id = base
      let n = 2
      while (usedIds.has(id)) id = `${base}-${n++}`
      usedIds.add(id)
      headings.push({ id, text, level: level as 2 | 3 })

      const attrsWithoutId = attrs.replace(/\s*id=["'][^"']*["']/i, "")
      return `<${tag}${attrsWithoutId} id="${id}">${inner}</${tag}>`
    },
  )

  const wordCount = clean
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return { html, headings, wordCount }
}
