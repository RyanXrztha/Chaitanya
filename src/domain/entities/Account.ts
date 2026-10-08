/** A guest account (no secrets — credentials stay inside the auth repository). */
export interface Account {
  id: string;
  name: string;
  /** At least one of phone / email is always present. */
  phone?: string;
  email?: string;
}

export interface SignUpRequest {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  /** Checked only when the form asks for it. */
  confirmPassword?: string;
  acceptedTerms: boolean;
}

export const MIN_PASSWORD_LENGTH = 6;
