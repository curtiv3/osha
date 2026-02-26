"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/auth-schema";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm text-text-secondary">
        Email
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary"
          {...form.register("email")}
        />
      </label>
      <label className="block text-sm text-text-secondary">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary"
          {...form.register("password")}
        />
      </label>
      {error ? <p className="text-sm text-accent-warm">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
