"use client"

interface BookingDetailsFormProps {
  topic: string
  notes: string
  onTopicChange: (v: string) => void
  onNotesChange: (v: string) => void
}

export function BookingDetailsForm({
  topic,
  notes,
  onTopicChange,
  onNotesChange,
}: BookingDetailsFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="booking-topic" className="text-sm font-medium text-foreground">
          Session topic <span className="text-destructive">*</span>
        </label>
        <input
          id="booking-topic"
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g. Improving my salah, understanding a Quranic verse…"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          A brief description of what you would like to discuss.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="booking-notes" className="text-sm font-medium text-foreground">
          Additional notes
        </label>
        <textarea
          id="booking-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any context, questions, or background information that may help…"
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}
