"use client";

import { useRef, useState } from "react";
import { SERVICE_SORT_OPTIONS } from "@/application";
import { Button, ButtonLink } from "@/presentation/components/ui/Button";
import { Field, Input } from "@/presentation/components/ui/Field";
import { ChevronDownIcon } from "@/presentation/components/ui/Icon";
import { Select } from "@/presentation/components/ui/Select";
import { useSearch } from "@/presentation/components/layout/SearchProvider";

export function PrimitivesDemo() {
  const [sort, setSort] = useState("featured");
  const anchor = useRef<HTMLDivElement>(null);
  const search = useSearch();
  return (
    <div className="mt-lg flex flex-col gap-lg">
      <div className="flex flex-wrap items-center gap-md">
        <Button>Primary</Button>
        <Button variant="outline" size="md">Load more</Button>
        <Button variant="outline-brand">Book a Treatment</Button>
        <ButtonLink href="/services" variant="primary" size="lg">Explore Services</ButtonLink>
        <Button variant="quiet" size="icon" aria-label="Open search" onClick={() => search.open()}>⌕</Button>
      </div>
      <div ref={anchor} className="relative flex h-11 w-[200px] items-center rounded-control border border-line-3 bg-white">
        <span className="pointer-events-none absolute left-md text-[13px] text-muted">Sort by</span>
        <Select
          label="Sort by"
          value={sort}
          onValueChange={setSort}
          options={SERVICE_SORT_OPTIONS}
          anchorRef={anchor}
          className="h-full w-full rounded-control border-0 bg-transparent pr-10 pl-[68px] font-body text-[15px] font-bold text-ink-dark"
        />
        <ChevronDownIcon size={16} className="pointer-events-none absolute right-md" />
      </div>
      <Field label="Full name" htmlFor="demo-name" required className="max-w-[360px]">
        <Input id="demo-name" placeholder="Your name" />
      </Field>
    </div>
  );
}
