"use client";

import { useState, useTransition, type FormEvent } from "react";

/**
 * Runs a server action from a form's onSubmit. Unlike `<form action>`, React does
 * not reset the fields afterwards, so nothing the guest typed is lost when the
 * server rejects a value.
 */
export function useFormAction<S>(action: (prev: S, data: FormData) => Promise<S>, initial: S) {
  const [state, setState] = useState(initial);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const next = await action(state, data);
      setState(next);
    });
  };

  return { state, pending, onSubmit };
}
