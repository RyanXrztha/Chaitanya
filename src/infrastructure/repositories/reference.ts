/** A short human-readable reference such as "CHY-M04821", unique within `taken`. */
export function uniqueReference(prefix: string, taken: { has(key: string): boolean }): string {
  let reference: string;
  do {
    reference = `CHY-${prefix}${String(Math.floor(Math.random() * 100_000)).padStart(5, "0")}`;
  } while (taken.has(reference));
  return reference;
}
