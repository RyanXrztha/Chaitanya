/** Contact details collected in the booking and checkout forms. */
export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export function firstName(c: Pick<CustomerDetails, "name">, fallback = "there"): string {
  return c.name.trim().split(/\s+/)[0] || fallback;
}
