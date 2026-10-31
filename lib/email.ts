import "server-only"
import nodemailer, { type Transporter } from "nodemailer"
import { formatBookingWhen } from "./booking-time"

// Email delivery via SMTP (Gmail by default). Configure with env vars:
//   SMTP_HOST   e.g. smtp.gmail.com
//   SMTP_PORT   e.g. 465
//   SMTP_USER   the sending Gmail address
//   SMTP_PASS   a 16-char Gmail App Password (not the account password)
//   EMAIL_FROM  e.g. "Iqra Khan <hello@example.com>" (defaults to SMTP_USER)
//
// When SMTP is not configured (typical in local dev), we fall back to logging
// the link to the server console so the verification/reset flows stay testable.

type EmailKind = "verify" | "reset"

let cachedTransporter: Transporter | null = null

// Whether SMTP credentials are present. Callers use this to decide whether to
// surface the dev fallback link (only shown when real email can't be sent).
export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT ?? 465)
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user, pass },
  })
  return cachedTransporter
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@localhost"
}

interface EmailCopy {
  subject: string
  heading: string
  intro: string
  buttonLabel: string
  outro: string
}

const COPY: Record<EmailKind, EmailCopy> = {
  verify: {
    subject: "Verify your email — Iqra Khan",
    heading: "Confirm your email address",
    intro:
      "Welcome to Iqra Khan. Please confirm your email address to secure your account and unlock purchases and your library.",
    buttonLabel: "Verify email address",
    outro: "This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.",
  },
  reset: {
    subject: "Reset your password — Iqra Khan",
    heading: "Reset your password",
    intro:
      "We received a request to reset the password for your Iqra Khan account. Click the button below to choose a new password.",
    buttonLabel: "Reset password",
    outro: "This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.",
  },
}

// Brand palette mirrors the site's light theme (see app/globals.css).
const BRAND = {
  ink: "#1a1713",
  primary: "#8a6d1c",
  cream: "#f7f3e8",
  muted: "#6b6459",
  bg: "#f6f4f0",
}

function renderHtml(copy: EmailCopy, link: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${BRAND.bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.cream};">
            <tr>
              <td style="background:${BRAND.cream};padding:24px 32px;text-align:center;">
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.ink};letter-spacing:0.5px;">Iqra Khan</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
                <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.ink};">${copy.heading}</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${copy.intro}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:9999px;background:${BRAND.primary};">
                      <a href="${link}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">${copy.buttonLabel}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${BRAND.muted};">Or paste this link into your browser:</p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;"><a href="${link}" style="color:${BRAND.primary};">${link}</a></p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">${copy.outro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:${BRAND.cream};text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};">
                © ${new Date().getFullYear()} Iqra Khan. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function renderText(copy: EmailCopy, link: string): string {
  return `${copy.heading}

${copy.intro}

${copy.buttonLabel}: ${link}

${copy.outro}

© ${new Date().getFullYear()} Iqra Khan`
}

export async function sendAuthEmail(opts: {
  kind: EmailKind
  to: string
  link: string
}): Promise<void> {
  const copy = COPY[opts.kind]
  const transporter = getTransporter()

  if (!transporter) {
    // No SMTP configured — log so dev flows still work via the devLink.
    // eslint-disable-next-line no-console
    console.log(`[email:${opts.kind}] ${copy.heading} for ${opts.to} -> ${opts.link}`)
    return
  }

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: opts.to,
      subject: copy.subject,
      text: renderText(copy, opts.link),
      html: renderHtml(copy, opts.link),
    })
  } catch (err) {
    // Never let a mail failure break signup / reset / resend. Log so the issue
    // is visible server-side; the user can retry (e.g. via the resend banner).
    // eslint-disable-next-line no-console
    console.error(`[email:${opts.kind}] failed to send to ${opts.to}:`, err)
  }
}

// Where contact-form messages are delivered. Falls back to the sending address
// (EMAIL_FROM / SMTP_USER) when CONTACT_TO isn't set.
function contactRecipient(): string {
  return process.env.CONTACT_TO || process.env.EMAIL_FROM || process.env.SMTP_USER || fromAddress()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export interface ContactMessage {
  name: string
  email: string
  /** Optional - the public form asks for it, but it isn't required. */
  phone?: string
  subject: string
  message: string
}

// Delivers a contact-form submission to the site owner. Throws when SMTP is
// configured but the send fails, so the calling action can surface an error to
// the user. When SMTP isn't configured (local dev), it logs and resolves so the
// flow stays testable.
export async function sendContactEmail(msg: ContactMessage): Promise<void> {
  const transporter = getTransporter()

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(
      `[email:contact] from ${msg.name} <${msg.email}> — ${msg.subject}\n${msg.message}`,
    )
    return
  }

  const safeMessage = escapeHtml(msg.message).replace(/\n/g, "<br>")
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid ${BRAND.cream};">
      <tr><td style="padding:24px 28px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px;color:${BRAND.ink};">New contact message</h1>
        <p style="margin:0 0 6px;font-size:14px;color:${BRAND.muted};"><strong>Name:</strong> ${escapeHtml(msg.name)}</p>
        <p style="margin:0 0 6px;font-size:14px;color:${BRAND.muted};"><strong>Email:</strong> ${escapeHtml(msg.email)}</p>
        ${msg.phone ? `<p style="margin:0 0 6px;font-size:14px;color:${BRAND.muted};"><strong>Phone:</strong> ${escapeHtml(msg.phone)}</p>` : ""}
        <p style="margin:0 0 16px;font-size:14px;color:${BRAND.muted};"><strong>Subject:</strong> ${escapeHtml(msg.subject)}</p>
        <div style="padding:16px;background:${BRAND.bg};border-radius:8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${safeMessage}</div>
      </td></tr>
    </table>
  </body>
</html>`
  const text = `New contact message\n\nName: ${msg.name}\nEmail: ${msg.email}${
    msg.phone ? `\nPhone: ${msg.phone}` : ""
  }\nSubject: ${msg.subject}\n\n${msg.message}`

  await transporter.sendMail({
    from: fromAddress(),
    to: contactRecipient(),
    replyTo: `${msg.name} <${msg.email}>`,
    subject: `[Contact] ${msg.subject}`,
    text,
    html,
  })
}

// ──────────────────────────────────────────────────────────────────────────
// Transactional emails
//
// Until now the only emails this site could send were "verify" and "reset".
// A customer who bought an e-book or booked a consultation received nothing at
// all - no receipt, no confirmation, no access link - even though SMTP has
// been configured the whole time. These two templates close that gap.
//
// Both follow sendAuthEmail's failure policy: never throw. An order is already
// paid and fulfilled by the time we get here, so a mail outage must not break
// the webhook or leave the customer's purchase in limbo. Failures are logged.
// ──────────────────────────────────────────────────────────────────────────

// Shared brand shell so every transactional email looks like the auth ones.
function renderShell(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${BRAND.bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.cream};">
            <tr>
              <td style="background:${BRAND.cream};padding:24px 32px;text-align:center;">
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.ink};letter-spacing:0.5px;">Iqra Khan</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
                <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.ink};">${heading}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:${BRAND.cream};text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};">
                © ${new Date().getFullYear()} Iqra Khan. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr><td style="border-radius:9999px;background:${BRAND.primary};">
    <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">${label}</a>
  </td></tr>
</table>`
}

export interface OrderEmailInput {
  to: string
  reference: string
  items: { title: string; quantity: number; price: number; type: "digital" | "physical" }[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  hasDigital: boolean
  hasPhysical: boolean
  shippingAddress?: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  } | null
  /** Absolute URL of the order page. */
  orderUrl: string
  /** Absolute URL of the customer's library, for digital orders. */
  libraryUrl: string
  /** Pre-formatted money strings, so this module stays currency-agnostic. */
  format: (minor: number) => string
}

export async function sendOrderConfirmationEmail(input: OrderEmailInput): Promise<void> {
  const transporter = getTransporter()
  const subject = `Order confirmed (${input.reference}) — Iqra Khan`

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(`[email:order] ${subject} -> ${input.to} (${input.orderUrl})`)
    return
  }

  const rows = input.items
    .map(
      (i) => `<tr>
  <td style="padding:8px 0;font-size:14px;color:${BRAND.ink};">${escapeHtml(i.title)}${
    i.quantity > 1 ? ` &times; ${i.quantity}` : ""
  }</td>
  <td style="padding:8px 0;font-size:14px;color:${BRAND.ink};text-align:right;white-space:nowrap;">${input.format(
    i.price * i.quantity,
  )}</td>
</tr>`,
    )
    .join("")

  const addr = input.shippingAddress
  const addressBlock = addr
    ? `<p style="margin:24px 0 6px;font-size:13px;font-weight:700;color:${BRAND.ink};">Delivery address</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${BRAND.muted};">
  ${escapeHtml(addr.fullName)}<br>
  ${escapeHtml(addr.line1)}<br>
  ${addr.line2 ? `${escapeHtml(addr.line2)}<br>` : ""}
  ${escapeHtml(addr.city)}${addr.state ? `, ${escapeHtml(addr.state)}` : ""} ${escapeHtml(addr.postalCode)}<br>
  ${escapeHtml(addr.country)}
</p>`
    : ""

  // Digital access is "unlocked in your library", never "download" - the
  // reader is in-browser only and the Terms prohibit downloading.
  const digitalBlock = input.hasDigital
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  Your digital items are unlocked and ready to read in your library, on any device.
</p>${button(input.libraryUrl, "Open my library")}`
    : ""

  const physicalBlock = input.hasPhysical
    ? `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  We'll email you again when your parcel is on its way. You can track the status of this order at any time from your account.
</p>`
    : ""

  const body = `<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  Thank you for your order. We've received your payment and your order reference is
  <strong style="color:${BRAND.ink};">${escapeHtml(input.reference)}</strong>.
</p>
${digitalBlock}
${physicalBlock}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border-top:1px solid ${BRAND.cream};">
  ${rows}
  <tr><td style="padding:8px 0;font-size:14px;color:${BRAND.muted};border-top:1px solid ${BRAND.cream};">Subtotal</td>
      <td style="padding:8px 0;font-size:14px;color:${BRAND.muted};text-align:right;border-top:1px solid ${BRAND.cream};">${input.format(input.subtotal)}</td></tr>
  <tr><td style="padding:4px 0;font-size:14px;color:${BRAND.muted};">Shipping</td>
      <td style="padding:4px 0;font-size:14px;color:${BRAND.muted};text-align:right;">${
        input.shipping === 0 ? "Free" : input.format(input.shipping)
      }</td></tr>
  <tr><td style="padding:8px 0;font-size:15px;font-weight:700;color:${BRAND.ink};border-top:1px solid ${BRAND.cream};">Total</td>
      <td style="padding:8px 0;font-size:15px;font-weight:700;color:${BRAND.ink};text-align:right;border-top:1px solid ${BRAND.cream};">${input.format(input.total)}</td></tr>
</table>
${addressBlock}
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${BRAND.muted};">
  View this order any time: <a href="${input.orderUrl}" style="color:${BRAND.primary};">${input.orderUrl}</a>
</p>`

  const text = `Order confirmed — ${input.reference}

Thank you for your order.

${input.items.map((i) => `- ${i.title}${i.quantity > 1 ? ` x${i.quantity}` : ""}  ${input.format(i.price * i.quantity)}`).join("\n")}

Subtotal: ${input.format(input.subtotal)}
Shipping: ${input.shipping === 0 ? "Free" : input.format(input.shipping)}
Total:    ${input.format(input.total)}
${input.hasDigital ? `\nYour digital items are unlocked in your library: ${input.libraryUrl}\n` : ""}
View this order: ${input.orderUrl}

© ${new Date().getFullYear()} Iqra Khan`

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: input.to,
      subject,
      text,
      html: renderShell("Your order is confirmed", body),
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[email:order] failed to send ${input.reference} to ${input.to}:`, err)
  }
}

export interface BookingEmailInput {
  to: string
  name: string
  sessionTitle: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM, 24-hour */
  slot: string
  durationMinutes: number
  /** Google Meet link, when Iqra has added one. */
  meetingUrl?: string | null
  bookingsUrl: string
}

export async function sendBookingConfirmationEmail(
  input: BookingEmailInput,
): Promise<void> {
  const transporter = getTransporter()
  // "Thu, Nov 5, 2026 at 2:00 PM IST" - the raw "2026-11-05 at 14:00" gave no
  // time zone, which matters to anyone booking from outside India.
  const when = formatBookingWhen(input.date, input.slot)
  const subject = `Your session is confirmed — ${when}`

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(`[email:booking] ${subject} -> ${input.to} (${input.meetingUrl ?? "no link yet"})`)
    return
  }

  // Only promise a joining link when one actually exists. The in-app
  // notification used to say "you will receive a calendar invite shortly"
  // while nothing in the system was capable of sending one.
  const joinBlock = input.meetingUrl
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  Join the session using the link below at your booked time. Sessions are held as a private <strong style="color:${BRAND.ink};">audio call</strong> on Google Meet — your camera is not required.
</p>${button(input.meetingUrl, "Join the session")}
<p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;color:${BRAND.muted};">
  Or paste this link into your browser: <a href="${input.meetingUrl}" style="color:${BRAND.primary};">${input.meetingUrl}</a>
</p>`
    : `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  Iqra will email you the Google Meet joining link before your session. Sessions are held as a private <strong style="color:${BRAND.ink};">audio call</strong> — your camera is not required.
</p>`

  const body = `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
  Assalamu alaikum ${escapeHtml(input.name)}, your session is confirmed.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:${BRAND.bg};border-radius:8px;">
  <tr><td style="padding:16px 20px;font-size:15px;line-height:1.8;color:${BRAND.ink};">
    <strong>${escapeHtml(input.sessionTitle)}</strong><br>
    ${escapeHtml(when)}<br>
    ${input.durationMinutes} minutes
  </td></tr>
</table>
${joinBlock}
<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${BRAND.muted};">
  Need to reschedule? You can do that from
  <a href="${input.bookingsUrl}" style="color:${BRAND.primary};">your bookings</a>.
</p>
<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:${BRAND.muted};">
  These are personal Islamic guidance sessions and do not constitute professional counselling, therapy, medical or legal advice.
</p>`

  const text = `Your session is confirmed

Assalamu alaikum ${input.name},

${input.sessionTitle}
${when} (${input.durationMinutes} minutes)

${
  input.meetingUrl
    ? `Join the audio call on Google Meet: ${input.meetingUrl}`
    : "Iqra will email you the Google Meet joining link before your session."
}

Manage your bookings: ${input.bookingsUrl}

These are personal Islamic guidance sessions and do not constitute professional
counselling, therapy, medical or legal advice.

© ${new Date().getFullYear()} Iqra Khan`

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: input.to,
      subject,
      text,
      html: renderShell("Your session is confirmed", body),
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[email:booking] failed to send to ${input.to}:`, err)
  }
}
