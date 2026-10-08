export type PaymentMethodId =
  | "cash-at-clinic"
  | "card-on-arrival"
  | "cash-on-delivery"
  | "esewa"
  | "khalti"
  | "mobile-banking";

export type PaymentKind = "in-person" | "wallet" | "bank";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  /** Secondary line, e.g. "Mobile wallet". */
  description: string;
  kind: PaymentKind;
  /** Paid online up-front (wallets, banking) vs. due at the clinic / on delivery. */
  prepaid: boolean;
}

export const PAYMENT_METHODS: Record<PaymentMethodId, PaymentMethod> = {
  "cash-at-clinic": { id: "cash-at-clinic", label: "Cash at Clinic", description: "Pay on the day", kind: "in-person", prepaid: false },
  "card-on-arrival": { id: "card-on-arrival", label: "Card on Arrival", description: "Visa / Mastercard", kind: "in-person", prepaid: false },
  "cash-on-delivery": { id: "cash-on-delivery", label: "Cash on Delivery", description: "Pay when it arrives", kind: "in-person", prepaid: false },
  esewa: { id: "esewa", label: "eSewa", description: "Mobile wallet", kind: "wallet", prepaid: true },
  khalti: { id: "khalti", label: "Khalti by IME", description: "Mobile wallet", kind: "wallet", prepaid: true },
  "mobile-banking": { id: "mobile-banking", label: "Mobile Banking", description: "Any Nepali bank", kind: "bank", prepaid: true },
};

/** Payment options offered at each checkout, in display order. */
export const BOOKING_PAYMENT_METHODS: PaymentMethodId[] = ["cash-at-clinic", "card-on-arrival", "esewa", "khalti", "mobile-banking"];
export const ORDER_PAYMENT_METHODS: PaymentMethodId[] = ["cash-on-delivery", "esewa", "khalti", "mobile-banking"];
