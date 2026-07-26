"use server"

import { z } from "zod"
import { sendContactEmail } from "@/lib/email"

export interface ContactState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(2, "Please enter a subject").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
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
    subject: formData.get("subject"),
    message: formData.get("message"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  try {
    await sendContactEmail(parsed.data)
    return { ok: true }
  } catch (err) {
    console.error("Contact form delivery failed:", err)
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again in a moment.",
    }
  }
}
