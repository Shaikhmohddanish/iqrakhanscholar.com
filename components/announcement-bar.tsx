const items = [
  'Free shipping on orders over $50',
  'New: 30 Day Quran Reflection Journey',
  'Limited consultation slots open this month',
  'Download your free Islamic self-improvement guide',
]

export function AnnouncementBar() {
  const loop = [...items, ...items]
  return (
    <div className="bg-arabesque overflow-hidden border-b border-primary/30 py-2 text-primary-foreground">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap text-xs tracking-wide">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-accent">✦</span>
            <span className="font-medium text-primary-foreground/90">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
