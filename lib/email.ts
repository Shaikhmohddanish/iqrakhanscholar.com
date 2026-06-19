import "server-only"
import nodemailer, { type Transporter } from "nodemailer"

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
  ink: "#6b5a47",
  primary: "#a89685",
  cream: "#f1ece6",
  muted: "#7c7066",
  bg: "#f6f4f1",
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
