import { ANY_THERAPIST_ID, type TherapistRepository } from "@/domain";
import { ANY_THERAPIST, THERAPISTS } from "../data/therapists.data";

export class InMemoryTherapistRepository implements TherapistRepository {
  async list() {
    return THERAPISTS;
  }

  async anyTherapist() {
    return ANY_THERAPIST;
  }

  async findById(id: string) {
    if (id === ANY_THERAPIST_ID) return ANY_THERAPIST;
    return THERAPISTS.find((t) => t.id === id) ?? null;
  }
}
