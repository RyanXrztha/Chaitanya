/** A picture that belongs to an entity (path relative to the site root). */
export interface ImageRef {
  src: string;
  alt: string;
  /** Short visible label, e.g. a gallery caption ("Treatment room"). */
  caption?: string;
}
