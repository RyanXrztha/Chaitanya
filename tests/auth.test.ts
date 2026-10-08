import { beforeEach, describe, expect, it } from "vitest";
import { SignInUseCase, SignUpUseCase } from "@/application";
import { ValidationError, type SignUpRequest } from "@/domain";
import { InMemoryAuthRepository } from "@/infrastructure/repositories/InMemoryAuthRepository";

const valid: SignUpRequest = {
  name: "Sita Rai",
  phone: "9811111111",
  email: "sita@example.com",
  password: "secret12",
  confirmPassword: "secret12",
  acceptedTerms: true,
};

describe("auth use cases", () => {
  let signIn: SignInUseCase;
  let signUp: SignUpUseCase;

  beforeEach(() => {
    const repo = new InMemoryAuthRepository();
    signIn = new SignInUseCase(repo);
    signUp = new SignUpUseCase(repo);
  });

  it("signs in the seeded demo account by email", async () => {
    const account = await signIn.execute("demo@chaitanyawellness.com.np", "chaitanya123");
    expect(account.name).toBe("Aarav Shrestha");
  });

  it("rejects a wrong password and empty credentials", async () => {
    await expect(signIn.execute("demo@chaitanyawellness.com.np", "nope")).rejects.toMatchObject({ field: "password" });
    await expect(signIn.execute("  ", "x")).rejects.toBeInstanceOf(ValidationError);
  });

  it("creates an account that can then sign in by phone", async () => {
    const created = await signUp.execute(valid);
    expect(created.phone).toBe("9811111111");
    const again = await signIn.execute("9811111111", "secret12");
    expect(again.email).toBe("sita@example.com");
  });

  it("validates sign-up fields in order", async () => {
    await expect(signUp.execute({ ...valid, name: "" })).rejects.toMatchObject({ field: "name" });
    await expect(signUp.execute({ ...valid, email: "bad" })).rejects.toMatchObject({ field: "email" });
    await expect(signUp.execute({ ...valid, password: "abc", confirmPassword: "abc" })).rejects.toMatchObject({ field: "password" });
    await expect(signUp.execute({ ...valid, confirmPassword: "other123" })).rejects.toMatchObject({ field: "confirmPassword" });
    await expect(signUp.execute({ ...valid, acceptedTerms: false })).rejects.toMatchObject({ field: "terms" });
  });

  it("accepts email-only or phone-only accounts, but not neither", async () => {
    const byEmail = await signUp.execute({ ...valid, phone: undefined, confirmPassword: undefined });
    expect(byEmail.phone).toBeUndefined();
    expect((await signIn.execute("sita@example.com", "secret12")).id).toBe(byEmail.id);
    const byPhone = await signUp.execute({ ...valid, phone: "9833333333", email: undefined });
    expect((await signIn.execute("+977 983-333-3333", "secret12")).id).toBe(byPhone.id);
    await expect(signUp.execute({ ...valid, phone: " ", email: "" })).rejects.toMatchObject({ field: "phone" });
    await expect(signUp.execute({ ...valid, phone: "12" })).rejects.toMatchObject({ field: "phone" });
  });

  it("refuses a duplicate phone or email", async () => {
    await signUp.execute(valid);
    await expect(signUp.execute({ ...valid, email: undefined })).rejects.toMatchObject({ field: "identifier" });
    await expect(signUp.execute({ ...valid, phone: "9822222222" })).rejects.toMatchObject({ field: "identifier" });
  });
});
