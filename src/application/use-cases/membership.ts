import type { MembershipRepository, MembershipTier, MembershipTierId } from "@/domain";

export class GetMembershipTiersUseCase {
  constructor(private readonly memberships: MembershipRepository) {}

  execute(): Promise<MembershipTier[]> {
    return this.memberships.listTiers();
  }

  async find(id: string): Promise<MembershipTier | null> {
    return (await this.memberships.listTiers()).find((t) => t.id === (id as MembershipTierId)) ?? null;
  }
}
