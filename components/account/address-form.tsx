"use client"

import { useState, useTransition } from "react"
import type { AddressDoc } from "@/lib/users"
import { saveAddressAction, deleteAddressAction } from "@/app/actions/account"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

interface AddressFormProps {
  addresses: AddressDoc[]
}

const EMPTY: Omit<AddressDoc, "id" | "isDefault"> = {
  label: "Home",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "GB",
}

export function AddressManager({ addresses }: AddressFormProps) {
  const [editing, setEditing] = useState<AddressDoc | null>(null)
  const [adding, setAdding] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<AddressDoc, "id" | "isDefault">>(EMPTY)
  const [isDefault, setIsDefault] = useState(false)

  function openAdd() {
    setForm(EMPTY)
    setIsDefault(addresses.length === 0)
    setEditing(null)
    setAdding(true)
    setError(null)
  }

  function openEdit(addr: AddressDoc) {
    setForm({ label: addr.label, fullName: addr.fullName, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country })
    setIsDefault(addr.isDefault)
    setEditing(addr)
    setAdding(false)
    setError(null)
  }

  function handleClose() {
    setAdding(false)
    setEditing(null)
    setError(null)
  }

  function handleSave() {
    setError(null)
    if (!form.fullName.trim() || !form.line1.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError("Please fill in all required fields.")
      return
    }
    startTransition(async () => {
      const result = await saveAddressAction({
        ...form,
        id: editing?.id ?? crypto.randomUUID(),
        isDefault,
      })
      if (result.error) {
        setError(result.error)
      } else {
        handleClose()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAddressAction(id)
    })
  }

  function field(id: keyof typeof form, label: string, required = false) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`addr-${id}`} className="text-sm font-medium text-foreground">
          {label}{required && <span className="text-destructive"> *</span>}
        </label>
        <input
          id={`addr-${id}`}
          type="text"
          value={form[id] ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="relative rounded-xl border border-border bg-muted/30 p-4">
            {addr.isDefault && (
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Default
              </span>
            )}
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm text-foreground">
                <p className="font-medium">{addr.label} — {addr.fullName}</p>
                <p className="text-muted-foreground">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p className="text-muted-foreground">{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postalCode}</p>
                <p className="text-muted-foreground">{addr.country}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={() => openEdit(addr)} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                <Pencil className="size-3" /> Edit
              </button>
              <button type="button" onClick={() => handleDelete(addr.id)} disabled={pending} className="flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 disabled:opacity-50">
                <Trash2 className="size-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 font-heading text-base font-semibold text-foreground">
            {editing ? "Edit address" : "New address"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("label", "Label (e.g. Home)", true)}
            {field("fullName", "Full name", true)}
            {field("line1", "Address line 1", true)}
            {field("line2", "Address line 2")}
            {field("city", "City", true)}
            {field("state", "County / State")}
            {field("postalCode", "Postcode / ZIP", true)}
            {field("country", "Country", true)}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-border" />
            Set as default address
          </label>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={handleSave} disabled={pending} className="flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60">
              {pending && <BarLoader size="sm" />}
              Save address
            </button>
            <button type="button" onClick={handleClose} className="h-9 rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={openAdd} className="flex h-10 w-fit items-center gap-2 rounded-full border border-dashed border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          <Plus className="size-4" /> Add address
        </button>
      )}
    </div>
  )
}
