"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TemplateEditor({ initialTemplates }: { initialTemplates: unknown }) {
  const [content, setContent] = useState(JSON.stringify(initialTemplates, null, 2));
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setStatus(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      setStatus("Ungültiges JSON.");
      return;
    }

    const res = await fetch("/api/admin/checklist-templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates: parsed }),
    });

    if (!res.ok) {
      setStatus("Speichern fehlgeschlagen.");
      return;
    }

    setStatus("Vorlagen gespeichert.");
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">OSHA-Regeln/Checklisten Content</h3>
      <textarea
        className="mt-4 h-72 w-full rounded-md border border-border bg-elevated p-3 font-data text-xs text-text-primary"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <Button type="button" variant="accent" onClick={save}>Content speichern</Button>
        {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
      </div>
    </article>
  );
}
