const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(s: string): boolean {
  return EMAIL.test(s);
}

/** Loose phone check: 7–15 digits once spaces, dashes, brackets and "+" are removed. */
export function isPhone(s: string): boolean {
  const digits = s.replace(/[\s\-().+]/g, "");
  return /^\d{7,15}$/.test(digits);
}
