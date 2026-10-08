import type { Account, AuthRepository } from "@/domain";

interface StoredAccount extends Account {
  salt: string;
  hash: string;
}

const normalize = (identifier: string) =>
  identifier.includes("@") ? identifier.trim().toLowerCase() : identifier.replace(/[^\d]/g, "").slice(-10);

async function digest(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Demo credential store kept in process memory. Seeded with one demo account
 * (demo@chaitanyawellness.com.np / chaitanya123). Replace with a real identity
 * provider before launch — this is not a production password store.
 */
export class InMemoryAuthRepository implements AuthRepository {
  private readonly accounts: StoredAccount[] = [];
  private readonly seeded: Promise<void>;

  constructor() {
    this.seeded = this.create(
      { name: "Aarav Shrestha", phone: "+977 9800000000", email: "demo@chaitanyawellness.com.np" },
      "chaitanya123",
    ).then(() => undefined);
  }

  private find(identifier: string) {
    const key = normalize(identifier);
    if (!key) return undefined;
    return this.accounts.find((a) => (a.email && normalize(a.email) === key) || (a.phone && normalize(a.phone) === key));
  }

  async exists(identifier: string) {
    await this.seeded;
    return !!this.find(identifier);
  }

  async verify(identifier: string, password: string): Promise<Account | null> {
    await this.seeded;
    const acc = this.find(identifier);
    if (!acc || (await digest(password, acc.salt)) !== acc.hash) return null;
    return { id: acc.id, name: acc.name, phone: acc.phone, email: acc.email };
  }

  async create(account: Omit<Account, "id">, password: string): Promise<Account> {
    const salt = globalThis.crypto.randomUUID();
    const stored: StoredAccount = { ...account, id: globalThis.crypto.randomUUID(), salt, hash: await digest(password, salt) };
    this.accounts.push(stored);
    return { id: stored.id, name: stored.name, phone: stored.phone, email: stored.email };
  }
}
