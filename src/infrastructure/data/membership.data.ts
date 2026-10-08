import type { MembershipTier } from "@/domain";

// Membership.dc.html › tiers
export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "For those starting their wellness journey.",
    annualPrice: 8000,
    perks: ["10% off all treatments", "1 complimentary massage / quarter", "Priority scheduling"],
    featured: false,
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "Ideal for guests with regular wellness goals.",
    annualPrice: 15000,
    perks: [
      "18% off all treatments",
      "2 complimentary massages / quarter",
      "Priority scheduling",
      "Free birthday facial",
      "1 guest pass / month",
    ],
    featured: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Full access for complete wellness immersion.",
    annualPrice: 28000,
    perks: [
      "25% off all treatments",
      "Unlimited quarterly massages",
      "Dedicated therapist",
      "Free annual detox package",
      "3 guest passes / month",
    ],
    featured: false,
  },
];
