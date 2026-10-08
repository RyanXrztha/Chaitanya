import type { Order, OrderRepository } from "@/domain";

/** Process-memory order store (no backend yet). */
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  async save(data: Omit<Order, "reference" | "placedAt">): Promise<Order> {
    let reference: string;
    do {
      reference = `CHY-P${String(Math.floor(Math.random() * 100_000)).padStart(5, "0")}`;
    } while (this.orders.has(reference));
    const order: Order = { ...data, reference, placedAt: new Date() };
    this.orders.set(reference, order);
    return order;
  }
}
