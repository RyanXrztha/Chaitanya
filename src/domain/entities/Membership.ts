export type MembershipTierId = "silver" | "gold" | "platinum";

/** An annual membership plan. Members join and renew at the front desk. */
export interface MembershipTier {
  id: MembershipTierId;
  name: string;
  tagline: string;
  /** Price per year, NPR. */
  annualPrice: number;
  perks: string[];
  /** Highlighted as "Most Popular". */
  featured: boolean;
}
