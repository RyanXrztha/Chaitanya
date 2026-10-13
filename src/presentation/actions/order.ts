"use server";

import { ORDER_PAYMENT_METHODS, isValidationError, type PaymentMethodId } from "@/domain";
import { container } from "@/infrastructure/container";

export type OrderFormState =
  | { status: "idle" }
  | { status: "success"; firstName: string; reference: string; total: number }
  | { status: "error"; message: string; field?: string };

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

/** Product checkout (single line, as in the product page "Buy Now" sheet). */
export async function placeOrderAction(_prev: OrderFormState, data: FormData): Promise<OrderFormState> {
  const payment = text(data, "payment") as PaymentMethodId;
  if (!ORDER_PAYMENT_METHODS.includes(payment)) {
    return { status: "error", message: "Please choose a payment method.", field: "payment" };
  }
  try {
    const order = await container.placeOrder.execute({
      lines: [
        {
          productId: Number(text(data, "productId")),
          sizeIndex: Number(text(data, "sizeIndex")),
          quantity: Number(text(data, "quantity")),
        },
      ],
      customer: { name: text(data, "name"), phone: text(data, "phone"), address: text(data, "address") },
      paymentMethodId: payment,
    });
    return {
      status: "success",
      firstName: order.customer.name.split(/\s+/)[0] || "friend",
      reference: order.reference,
      total: order.total,
    };
  } catch (e) {
    if (isValidationError(e)) return { status: "error", message: e.message, field: e.field };
    console.error("placeOrderAction failed", e);
    return { status: "error", message: "We couldn’t place your order. Please try again or call us." };
  }
}
