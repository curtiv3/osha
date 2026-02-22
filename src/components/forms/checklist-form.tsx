"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SiteOption { id: string; name: string }

export function ChecklistForm({ sites }: { sites: SiteOption[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");
  const [items, setItems] = useState("Guardrails installed\nPPE available");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setOk(null);
    const response = await fetch("/api/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId,
        title,
        description,
        items: items.split("\n").map((line) => line.trim()).filter(Boolean),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not create checklist.");
      return;
    }

    setOk("Checklist erstellt.");
    setTitle("");
    setDescription("");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">Neue Checkliste</h3>
      <div className="mt-4 grid gap-3">
        <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary">
          {sites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beschreibung" className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
        <textarea value={items} onChange={(e) => setItems(e.target.value)} rows={5} className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
        {error ? <p className="text-sm text-accent-warm">{error}</p> : null}
        {ok ? <p className="text-sm text-accent-cool">{ok}</p> : null}
        <Button type="button" variant="accent" onClick={submit}>Speichern</Button>
      </div>
    </div>
  );
}
