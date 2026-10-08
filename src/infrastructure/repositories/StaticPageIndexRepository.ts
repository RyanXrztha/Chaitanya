import type { PageIndexRepository } from "@/domain";
import { PAGE_ENTRIES } from "../data/pages.data";

export class StaticPageIndexRepository implements PageIndexRepository {
  async listPages() {
    return PAGE_ENTRIES;
  }
}
