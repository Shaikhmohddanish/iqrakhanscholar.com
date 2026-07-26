// Client-safe order types (no DB/server-only imports)

export type OrderStatus = "processing" | "fulfilled" | "cancelled"
export type PaymentStatus = "paid" | "pending" | "failed"
export type PaymentProviderName = "stripe" | "razorpay" | "simulated"

export interface OrderItem {
  productId: string
  slug: string
  title: string
  image: string
  price: number
  type: "digital" | "physical"
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface PublicOrder {
  id: string
  reference: string
  userId: string
  email: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentProvider?: PaymentProviderName
  // provider-side reference (Checkout session / payment link id)
  providerRef?: string
  shippingAddress?: ShippingAddress | null
  hasDigital: boolean
  hasPhysical: boolean
  createdAt: Date
  updatedAt: Date
}
