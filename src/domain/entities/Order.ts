import type { Npr } from "../value-objects/Money";
import type { CustomerDetails } from "./Customer";
import type { PaymentMethodId } from "./Payment";

export interface OrderLine {
  productId: number;
  /** Index into the product sizes list. */
  sizeIndex: number;
  quantity: number;
}

export interface OrderRequest {
  lines: OrderLine[];
  customer: CustomerDetails & { address: string };
  paymentMethodId: PaymentMethodId;
}

export interface PricedOrderLine extends OrderLine {
  productName: string;
  sizeLabel: string;
  unitPrice: Npr;
  lineTotal: Npr;
}

export interface Order {
  /** e.g. "CHY-P48213" */
  reference: string;
  lines: PricedOrderLine[];
  customer: OrderRequest["customer"];
  paymentMethodId: PaymentMethodId;
  total: Npr;
  placedAt: Date;
}

export const MAX_ORDER_QUANTITY = 20;
