"use client"

interface BookingDetailsFormProps {
  topic: string
  onTopicChange: (v: string) => void
}

export function BookingDetailsForm({ topic, onTopicChange }: BookingDetailsFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="booking-topic" className="text-sm font-medium text-foreground">
        Questions you&apos;d like to discuss during the session{" "}
        <span className="text-destructive">*</span>
      </label>
      <textarea
        id="booking-topic"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="e.g. How can I improve my khushu in salah? How should I approach understanding a specific Quranic verse?…"
        rows={5}
        required
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-xs text-muted-foreground">
        List the questions you want Iqra to cover - this helps her prepare for your session.
      </p>
    </div>
  )
}
