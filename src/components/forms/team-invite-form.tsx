"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TeamInviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"SITE_MANAGER" | "ADMIN">("SITE_MANAGER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
    null,
  );

  async function submit() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) {
        setMessage({
          text: data?.error ?? "Could not send invite.",
          ok: false,
        });
        return;
      }
      setMessage({ text: `Invite sent to ${email}.`, ok: true });
      setEmail("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary placeholder:text-text-tertiary";

  return (
    <div className="rounded-lg border border-border bg-surface p-3 sm:p-4">
      <h3 className="font-heading text-lg text-text-primary">
        Invite Team Member
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        They&apos;ll get an account linked to your company and subscription.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@example.com"
          className={inputClasses}
        />
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "SITE_MANAGER" | "ADMIN")
          }
          className={inputClasses}
        >
          <option value="SITE_MANAGER">Site Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <Button
          type="button"
          variant="accent"
          onClick={submit}
          disabled={loading || !email}
          className="mt-1 sm:mt-0"
        >
          {loading ? "Sending..." : "Invite"}
        </Button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${message.ok ? "text-green-500" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
