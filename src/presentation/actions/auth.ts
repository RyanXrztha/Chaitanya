"use server";

import { isValidationError, type Account, type SignUpRequest } from "@/domain";
import { container } from "@/infrastructure/container";

export type AuthResult = { ok: true; account: Account } | { ok: false; message: string; field?: string };

function fail(e: unknown): AuthResult {
  if (isValidationError(e)) return { ok: false, message: e.message, field: e.field };
  console.error("auth action failed", e);
  return { ok: false, message: "Something went wrong. Please try again." };
}

export async function signInAction(identifier: string, password: string): Promise<AuthResult> {
  try {
    return { ok: true, account: await container.signIn.execute(identifier, password) };
  } catch (e) {
    return fail(e);
  }
}

export async function signUpAction(input: SignUpRequest): Promise<AuthResult> {
  try {
    return { ok: true, account: await container.signUp.execute(input) };
  } catch (e) {
    return fail(e);
  }
}
