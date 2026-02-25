"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ComplianceChatForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/compliance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: { response?: string };
      } | null;
      if (!res.ok) {
        setError(data?.error ?? "Chat request failed.");
        return;
      }
      setResponse(data?.message?.response ?? "");
      setPrompt("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">
        AI Compliance Chat
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        Ask about OSHA standards, penalties, or what to do before an inspection.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder='e.g. "What is the penalty for a fall protection violation?" or "Do I need a trench box at 4 feet?"'
        className="mt-3 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary placeholder:text-text-tertiary"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-3">
        <Button
          type="button"
          variant="accent"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </div>
      {response && (
        <div className="mt-4 rounded-md border border-border bg-elevated p-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent-warm">
            AI Response
          </p>
          <p className="whitespace-pre-line text-sm text-text-secondary">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
