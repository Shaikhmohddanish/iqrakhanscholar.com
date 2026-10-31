// Client-safe order types (no DB/server-only imports)

export type OrderStatus = "processing" | "fulfilled" | "cancelled"
// "refunded" was always written to the database (via a cast in the admin
// refund action) but was missing from this union, so every read of an order
// was typed as if a refunded order could not exist.
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"
export type PaymentProviderName = "stripe" | "razorpay" | "simulated"
// How the order was placed: from the cart, or a product's Buy Now button.
export type CheckoutSource = "cart" | "buy-now"

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
  // A Buy Now order never touched the cart, so the order page must not empty
  // the cart when it's paid. Absent on orders from before Buy Now (= cart).
  checkoutSource?: CheckoutSource
  createdAt: Date
  updatedAt: Date
}
