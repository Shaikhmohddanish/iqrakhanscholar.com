"use server"

import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { sendContactEmail } from "@/lib/email"

export interface SubscribeState {
  ok?: boolean
  error?: string
}

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  name: z.string().trim().max(80).optional(),
  // Where the signup came from, so Iqra can tell the guide list from the
  // newsletter list.
  source: z.enum(["guide", "newsletter"]).default("newsletter"),
})

/**
 * Stores a subscriber and notifies the site owner.
 *
 * Previously both signup forms were dead: the free-guide form only flipped a
 * piece of React state (while telling the visitor "your guide is on its way"),
 * and the footer newsletter posted to `action="#"`, reloading the page and
 * discarding the address. Every address collected so far was lost.
 */
export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    source: formData.get("source") || undefined,
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your email address." }
  }
  const { email, name, source } = parsed.data

  try {
    const db = await getDb()
    // Upsert on email so re-submitting doesn't create duplicates.
    await db.collection("subscribers").updateOne(
      { email },
      {
        $set: { email, name: name ?? "", source, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    )
  } catch (err) {
    console.error("Subscriber save failed:", err)
    return { ok: false, error: "Something went wrong. Please try again in a moment." }
  }

  // Best-effort notification - a mail failure must not lose the subscriber we
  // just stored, so this is deliberately not awaited into the error path.
  try {
    await sendContactEmail({
      name: name || "New subscriber",
      email,
      subject: source === "guide" ? "Free guide signup" : "Newsletter signup",
      message: `${email} signed up via the ${source} form.`,
    })
  } catch (err) {
    console.error("Subscriber notification failed (address was saved):", err)
  }

  return { ok: true }
}
