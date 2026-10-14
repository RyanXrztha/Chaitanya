"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Account } from "@/domain";

const KEY = "chy-account";
const listeners = new Set<() => void>();

function read(): Account | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

let cache: { raw: string | null; value: Account | null } = { raw: null, value: null };
function snapshot(): Account | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {}
  if (raw !== cache.raw) cache = { raw, value: read() };
  return cache.value;
}

function write(account: Account | null) {
  try {
    if (account) sessionStorage.setItem(KEY, JSON.stringify(account));
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

interface AccountContextValue {
  account: Account | null;
  setAccount: (a: Account) => void;
  signOut: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/**
 * The signed-in guest for this browser session (profile only — no credentials or
 * tokens are stored). Swap for a real session once an identity provider exists.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const account = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot,
    () => null,
  );
  const setAccount = useCallback((a: Account) => write(a), []);
  const signOut = useCallback(() => write(null), []);
  const value = useMemo(() => ({ account, setAccount, signOut }), [account, setAccount, signOut]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}

/** "Sign In", or the signed-in guest’s first name. */
export function AccountLabel() {
  const { account } = useAccount();
  if (!account) return <>Sign In</>;
  return (
    <span className="max-w-[9rem] truncate">
      <span className="sr-only">Your account: </span>
      {account.name.split(" ")[0]}
    </span>
  );
}
