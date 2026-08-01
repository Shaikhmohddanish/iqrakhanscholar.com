"use server"

import { z } from "zod"
import { sendContactEmail } from "@/lib/email"

export interface ContactState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

// The public form collects name / email / phone / comment. Email is the only
// required contact detail; `subject` is no longer asked for, so it's fixed here
// (it only ever fed the notification email's subject line).
const CONTACT_SUBJECT = "Website enquiry"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(40).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message")
    .max(5000, "Message is too long"),
})

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  try {
    await sendContactEmail({ ...parsed.data, subject: CONTACT_SUBJECT })
    return { ok: true }
  } catch (err) {
    console.error("Contact form delivery failed:", err)
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again in a moment.",
    }
  }
}
