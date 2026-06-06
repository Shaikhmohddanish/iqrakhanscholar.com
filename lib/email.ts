// Email delivery stub.
//
// No email provider is configured yet. In production, wire this up to a
// transactional email service (Resend, Postmark, SES, etc.) and send the
// links below. For now we log to the server so the verification and
// password-reset flows are fully testable in development.

type EmailKind = "verify" | "reset"

export async function sendAuthEmail(opts: {
  kind: EmailKind
  to: string
  link: string
}): Promise<void> {
  const label = opts.kind === "verify" ? "Verify your email" : "Reset your password"
  // eslint-disable-next-line no-console
  console.log(`[v0] [email:${opts.kind}] ${label} for ${opts.to} -> ${opts.link}`)
}
