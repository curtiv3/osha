"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/auth-schema";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "SITE_MANAGER",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Registration failed.");
      return;
    }

    router.push("/login");
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm text-text-secondary">
        Name
        <input className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" {...form.register("name")} />
      </label>
      <label className="block text-sm text-text-secondary">
        Email
        <input type="email" className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" {...form.register("email")} />
      </label>
      <label className="block text-sm text-text-secondary">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary"
          {...form.register("password")}
        />
      </label>
      <label className="block text-sm text-text-secondary">
        Role
        <select className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" {...form.register("role")}>
          <option value="SITE_MANAGER">Site Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>
      {error ? <p className="text-sm text-accent-warm">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}
