import type { MembershipRepository } from "@/domain";
import { MEMBERSHIP_TIERS } from "../data/membership.data";

export class StaticMembershipRepository implements MembershipRepository {
  async listTiers() {
    return MEMBERSHIP_TIERS;
  }
}
