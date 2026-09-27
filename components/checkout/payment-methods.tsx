import { ShieldCheck } from 'lucide-react'

/**
 * The payment methods accepted at checkout, as recognisable brand marks.
 *
 * Everything payment-related on the site was previously text plus a generic
 * lucide padlock - no Razorpay, UPI, Visa or Mastercard mark anywhere, and no
 * asset in /public for one. Inline SVG rather than image files so there is no
 * extra network request, no CLS, and nothing to go missing from the CDN.
 *
 * Wordmarks are drawn in currentColor rather than brand colours: at this size
 * full-colour logos look like clip-art, and muted marks read as a trust strip
 * rather than advertising.
 */
const CARD_CLASS =
  'flex h-8 items-center justify-center rounded-md border border-border bg-card px-2.5 text-muted-foreground'

export function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={CARD_CLASS} title="Razorpay">
          <RazorpayMark />
        </span>
        <span className={CARD_CLASS} title="UPI">
          <UpiMark />
        </span>
        <span className={CARD_CLASS} title="Visa">
          <VisaMark />
        </span>
        <span className={CARD_CLASS} title="Mastercard">
          <MastercardMark />
        </span>
        <span className={CARD_CLASS} title="RuPay">
          <RupayMark />
        </span>
        <span className={`${CARD_CLASS} text-[10px] font-medium uppercase tracking-wide`}>
          Net banking
        </span>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        Payments are processed by Razorpay. We never see or store your card details.
      </p>
    </div>
  )
}

function RazorpayMark() {
  return (
    <svg viewBox="0 0 80 20" className="h-3.5 w-auto" role="img" aria-label="Razorpay">
      <path
        fill="currentColor"
        d="M4.9 6.3 3.6 11l6-3.6-2.8 10.4h4.2L16.6 0 4.9 6.3ZM1.7 13.2.6 17.8h4.1l1.7-6.4-4.7 1.8Z"
      />
      <text
        x="20"
        y="15"
        fill="currentColor"
        fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="600"
      >
        Razorpay
      </text>
    </svg>
  )
}

function UpiMark() {
  return (
    <svg viewBox="0 0 38 16" className="h-3.5 w-auto" role="img" aria-label="UPI">
      <text
        x="0"
        y="12.5"
        fill="currentColor"
        fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        letterSpacing="0.5"
      >
        UPI
      </text>
    </svg>
  )
}

function VisaMark() {
  return (
    <svg viewBox="0 0 40 14" className="h-3 w-auto" role="img" aria-label="Visa">
      <text
        x="0"
        y="12"
        fill="currentColor"
        fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.3"
      >
        VISA
      </text>
    </svg>
  )
}

function MastercardMark() {
  // The two interlocking circles are the recognisable part; drawn in
  // currentColor at partial opacity so the overlap still reads.
  return (
    <svg viewBox="0 0 30 18" className="h-4 w-auto" role="img" aria-label="Mastercard">
      <circle cx="11" cy="9" r="7" fill="currentColor" opacity="0.55" />
      <circle cx="19" cy="9" r="7" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

function RupayMark() {
  return (
    <svg viewBox="0 0 46 14" className="h-3 w-auto" role="img" aria-label="RuPay">
      <text
        x="0"
        y="12"
        fill="currentColor"
        fontSize="12"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
      >
        RuPay
      </text>
    </svg>
  )
}
