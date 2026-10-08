import {
  MAX_ORDER_QUANTITY,
  NotFoundError,
  ORDER_PAYMENT_METHODS,
  ValidationError,
  priceForSize,
  type Order,
  type OrderRepository,
  type OrderRequest,
  type PricedOrderLine,
  type ProductRepository,
} from "@/domain";

/** Product checkout (Cash on Delivery / eSewa / Khalti / Mobile Banking). */
export class PlaceOrderUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly orders: OrderRepository,
  ) {}

  async execute(req: OrderRequest): Promise<Order> {
    if (!req.lines.length) throw new ValidationError("Your cart is empty.", "lines");
    const sizes = await this.products.listSizes();

    const lines: PricedOrderLine[] = [];
    for (const line of req.lines) {
      const product = await this.products.findById(line.productId);
      if (!product) throw new NotFoundError("Product", line.productId);
      const size = sizes[line.sizeIndex];
      if (!size) throw new ValidationError("Please choose a valid size.", "size");
      if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_ORDER_QUANTITY) {
        throw new ValidationError(`Quantity must be between 1 and ${MAX_ORDER_QUANTITY}.`, "quantity");
      }
      const unitPrice = priceForSize(product, size);
      lines.push({ ...line, productName: product.name, sizeLabel: size.label, unitPrice, lineTotal: unitPrice * line.quantity });
    }

    const name = req.customer.name.trim();
    const phone = req.customer.phone.trim();
    const address = req.customer.address.trim();
    if (!name) throw new ValidationError("Please enter your full name.", "name");
    if (!phone) throw new ValidationError("Please enter your phone number.", "phone");
    if (!address) throw new ValidationError("Please enter a delivery address.", "address");
    if (!ORDER_PAYMENT_METHODS.includes(req.paymentMethodId)) {
      throw new ValidationError("Please choose a payment method.", "payment");
    }

    return this.orders.save({
      lines,
      customer: { ...req.customer, name, phone, address },
      paymentMethodId: req.paymentMethodId,
      total: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    });
  }
}
