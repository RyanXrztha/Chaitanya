"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ORDER_PAYMENT_METHODS, PAYMENT_METHODS, formatNpr, type PaymentMethodId } from "@/domain";
import { placeOrderAction, type OrderFormState } from "@/presentation/actions/order";
import { useEscapeKey } from "@/presentation/hooks/useEscapeKey";
import { useScrollLock } from "@/presentation/hooks/useScrollLock";
import { cn } from "@/presentation/lib/cn";
import { CheckIcon, CloseIcon } from "../../ui/Icon";

interface CheckoutModalProps {
  productId: number;
  name: string;
  image: { src: string; alt: string };
  sizeIndex: number;
  sizeLabel: string;
  quantity: number;
  total: number;
  onClose: () => void;
  onPlaced: () => void;
}

const labelText = "font-body text-[12px] font-bold tracking-[0.04em] text-ink uppercase";
const inputClass =
  "box-border h-12 rounded-control border border-line-2 bg-surface-2 px-md font-body text-[15px] text-ink placeholder:text-subtle";

/** Buy Now sheet: order summary, delivery details, payment choice → "Order Placed". */
export function CheckoutModal(props: CheckoutModalProps) {
  const [state, action, pending] = useActionState<OrderFormState, FormData>(placeOrderAction, { status: "idle" });
  const [payment, setPayment] = useState<PaymentMethodId>("cash-on-delivery");
  const panelRef = useRef<HTMLDivElement>(null);
  const { onPlaced } = props;
  useScrollLock(true);
  useEscapeKey(true, props.onClose);

  const placed = state.status === "success";
  useEffect(() => {
    if (placed) onPlaced();
  }, [placed, onPlaced]);
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("input,button")?.focus({ preventScroll: true });
  }, [placed]);

  const totalLabel = formatNpr(placed ? state.total : props.total, { decimals: true });

  return (
    <div
      onClick={props.onClose}
      className="fixed inset-0 z-[60] box-border flex items-center justify-center overflow-y-auto bg-[rgba(7,46,52,0.55)] p-5 animate-[chy-fade-in_.2s_ease_both]"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
        className="relative box-border max-h-[calc(100vh-40px)] w-full max-w-[560px] overflow-y-auto rounded-panel bg-white p-[clamp(24px,4vw,48px)] animate-[chy-pd-modal-in_.45s_var(--ease-chy)_both]"
      >
        <button
          type="button"
          onClick={props.onClose}
          aria-label="Close"
          className="absolute top-md right-md flex size-9 items-center justify-center rounded-control border-0 bg-surface-3 text-ink hover:bg-brand-100 hover:text-brand"
        >
          <CloseIcon size={18} strokeWidth={2} />
        </button>

        {placed ? (
          <div className="py-lg text-center" role="status">
            <div className="mx-auto mb-md flex size-16 items-center justify-center rounded-card bg-brand-100 text-brand">
              <CheckIcon size={30} strokeWidth={2.4} />
            </div>
            <h3 id="checkout-title" className="mt-0 mb-sm font-heading text-[26px] font-bold text-ink max-md:text-[21px]">
              Order Placed
            </h3>
            <p className="mx-auto mt-0 mb-sm max-w-[38ch] font-body text-[15px] leading-[1.6] text-muted">
              Thank you, {state.firstName}. We’ll call you to confirm delivery.
            </p>
            <p className="mt-0 mb-lg font-body text-[13.5px] text-subtle">
              Order {state.reference} · {totalLabel}
            </p>
            <button
              type="button"
              onClick={props.onClose}
              className="h-12 rounded-control border-0 bg-brand px-[26px] font-body text-[15px] font-medium text-white hover:bg-brand-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h3 id="checkout-title" className="mt-0 mb-md font-heading text-[26px] font-bold text-ink max-md:text-[21px]">
              Checkout
            </h3>
            <div className="mb-lg flex items-center gap-md rounded-card bg-surface p-[14px]">
              <div className="relative size-16 flex-none overflow-hidden rounded-chip">
                <Image src={props.image.src} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-body text-[15px] font-bold text-ink">{props.name}</span>
                <span className="mt-0.5 block font-body text-[13px] text-muted">
                  {props.sizeLabel} · Qty {props.quantity}
                </span>
              </div>
              <span className="font-heading text-[17px] font-bold text-brand max-md:text-[15px]">{totalLabel}</span>
            </div>

            <form action={action} className="flex flex-col gap-md">
              <input type="hidden" name="productId" value={props.productId} />
              <input type="hidden" name="sizeIndex" value={props.sizeIndex} />
              <input type="hidden" name="quantity" value={props.quantity} />
              <input type="hidden" name="payment" value={payment} />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
                <label className="flex flex-col gap-sm">
                  <span className={labelText}>Full Name</span>
                  <input name="name" type="text" autoComplete="name" required className={inputClass} />
                </label>
                <label className="flex flex-col gap-sm">
                  <span className={labelText}>Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" required placeholder="+977" className={inputClass} />
                </label>
              </div>
              <label className="flex flex-col gap-sm">
                <span className={labelText}>Delivery Address</span>
                <input name="address" type="text" autoComplete="street-address" required placeholder="Street, area, city" className={inputClass} />
              </label>
              <div>
                <span className={cn(labelText, "mb-sm block")} id="pay-label">
                  Payment
                </span>
                <div role="radiogroup" aria-labelledby="pay-label" className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-sm">
                  {ORDER_PAYMENT_METHODS.map((id) => {
                    const on = id === payment;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setPayment(id)}
                        className={cn(
                          "h-12 rounded-control border-[1.5px] px-3 font-body text-[13.5px] font-medium transition-colors duration-200",
                          on ? "border-brand bg-brand-100 text-brand" : "border-line-2 bg-surface-2 text-ink hover:border-brand",
                        )}
                      >
                        {PAYMENT_METHODS[id].label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {state.status === "error" && (
                <p role="alert" className="m-0 font-body text-[13.5px] text-danger">
                  {state.message}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="mt-sm h-[52px] rounded-control border-0 bg-brand font-body text-[15px] font-medium text-white hover:bg-brand-600 disabled:opacity-70"
              >
                {pending ? "Placing order…" : `Place Order · ${totalLabel}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
