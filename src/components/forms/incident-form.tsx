"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SiteOption { id: string; name: string }

export function IncidentForm({ sites }: { sites: SiteOption[] }) {
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setMessage(null);
    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, title, details, severity, imageUrl: imageUrl || undefined }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setMessage(data?.error ?? "Incident konnte nicht gespeichert werden.");
      return;
    }

    setMessage("Incident gespeichert und AI-Analyse erstellt.");
    setTitle("");
    setDetails("");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">Incident melden</h3>
      <div className="mt-4 grid gap-3">
        <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary">
          {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Details" className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" rows={4} />
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary">
          <option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option><option value="CRITICAL">CRITICAL</option>
        </select>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="rounded-md border border-border bg-elevated px-3 py-2 text-text-primary" />
        {message ? <p className="text-sm text-text-secondary">{message}</p> : null}
        <Button type="button" variant="accent" onClick={submit}>Absenden</Button>
      </div>
    </div>
  );
}
