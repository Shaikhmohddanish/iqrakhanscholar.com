import { BookOpen, FileText } from 'lucide-react'

interface BookTocPreviewProps {
  chapters: string[]
}

// Mock chapter list
const defaultChapters = [
  'Introduction — Setting Your Intention',
  'Chapter 1 — Understanding the Foundation',
  'Chapter 2 — The Heart of the Matter',
  'Chapter 3 — Daily Practices',
  'Chapter 4 — Overcoming Obstacles',
  'Chapter 5 — Building Consistency',
  'Chapter 6 — Community & Support',
  'Chapter 7 — Advanced Concepts',
  'Chapter 8 — Living It Daily',
  'Conclusion — Your Journey Forward',
  'Appendix — Additional Resources',
]

export function BookTocPreview({ chapters = defaultChapters }: Partial<BookTocPreviewProps>) {
  const displayChapters = chapters || defaultChapters

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <BookOpen className="size-5 text-primary" />
        <h3 className="font-heading text-base font-semibold text-foreground">
          Table of Contents
        </h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {displayChapters.length} chapters
        </span>
      </div>
      <ul className="divide-y divide-border">
        {displayChapters.map((chapter, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
              {i + 1}
            </span>
            <span className="text-sm text-foreground">{chapter}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
