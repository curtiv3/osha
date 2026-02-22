"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ComplianceChatForm() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const res = await fetch("/api/compliance-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string; message?: { response?: string } } | null;
    if (!res.ok) {
      setError(data?.error ?? "Chat request failed.");
      return;
    }
    setResponse(data?.message?.response ?? "");
    setPrompt("");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">AI Compliance Chat</h3>
      <p className="mt-1 text-sm text-text-secondary">Fragen wie: „Welche Strafe bei repeat violation?“</p>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="mt-3 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
      {error ? <p className="mt-2 text-sm text-accent-warm">{error}</p> : null}
      <div className="mt-3"><Button type="button" variant="accent" onClick={submit}>Frage senden</Button></div>
      {response ? <p className="mt-4 rounded-md border border-border bg-elevated p-3 text-sm text-text-secondary">{response}</p> : null}
    </div>
  );
}
