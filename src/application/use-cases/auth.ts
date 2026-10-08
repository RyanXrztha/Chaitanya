import {
  MIN_PASSWORD_LENGTH,
  ValidationError,
  type Account,
  type AuthRepository,
  type SignUpRequest,
} from "@/domain";
import { isEmail, isPhone } from "./validation";

export class SignInUseCase {
  constructor(private readonly auth: AuthRepository) {}

  async execute(identifier: string, password: string): Promise<Account> {
    const id = identifier.trim();
    if (!id || !password) throw new ValidationError("Please enter your email or phone and password.", "identifier");
    const account = await this.auth.verify(id, password);
    if (!account) throw new ValidationError("That email/phone and password don’t match an account.", "password");
    return account;
  }
}

/** Creates an account from a name, at least one contact (phone or email) and a password. */
export class SignUpUseCase {
  constructor(private readonly auth: AuthRepository) {}

  async execute(req: SignUpRequest): Promise<Account> {
    const name = req.name.trim();
    const phone = req.phone?.trim() || undefined;
    const email = req.email?.trim() || undefined;
    if (!name) throw new ValidationError("Please enter your full name.", "name");
    if (!phone && !email) throw new ValidationError("Please add a phone number or an email address.", "phone");
    if (email && !isEmail(email)) throw new ValidationError("Please enter a valid email address.", "email");
    if (phone && !isPhone(phone)) throw new ValidationError("Please enter a valid phone number.", "phone");
    if (req.password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, "password");
    }
    if (req.confirmPassword !== undefined && req.password !== req.confirmPassword) {
      throw new ValidationError("Passwords do not match.", "confirmPassword");
    }
    if (!req.acceptedTerms) throw new ValidationError("Please accept the Terms & Privacy Policy.", "terms");
    if ((phone && (await this.auth.exists(phone))) || (email && (await this.auth.exists(email)))) {
      throw new ValidationError("An account with these details already exists — please sign in.", "identifier");
    }
    return this.auth.create({ name, phone, email }, req.password);
  }
}
