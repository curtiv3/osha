"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { OshaChecklistTemplate } from "@/lib/osha/default-checklists";

interface SiteOption {
  id: string;
  name: string;
}

export function ChecklistForm({
  sites,
  templates,
}: {
  sites: SiteOption[];
  templates: OshaChecklistTemplate[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");
  const [items, setItems] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
    null,
  );

  function applyTemplate(index: number) {
    const template = templates[index];
    if (!template) return;
    setTitle(template.title);
    setDescription(template.description);
    setItems(template.items.join("\n"));
  }

  async function submit() {
    setMessage(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          title,
          description,
          items: items
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setMessage({
          text: data?.error ?? "Could not create checklist.",
          ok: false,
        });
        return;
      }

      setMessage({ text: "Checklist created.", ok: true });
      setTitle("");
      setDescription("");
      setItems("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary placeholder:text-text-tertiary";

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">New Checklist</h3>

      {/* Template picker */}
      <div className="mt-4">
        <label className="text-sm font-medium text-text-secondary">
          Start from OSHA template
        </label>
        <select
          defaultValue=""
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            if (!isNaN(idx)) applyTemplate(idx);
          }}
          className={inputClasses}
        >
          <option value="" disabled>
            Choose a template...
          </option>
          {templates.map((t, i) => (
            <option key={t.standard} value={i}>
              {t.title} — {t.standard}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <label className="text-sm font-medium text-text-secondary">
            Site
          </label>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className={inputClasses}
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fall Protection Daily Walk"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this checklist covers"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Checklist items (one per line)
          </label>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            rows={6}
            placeholder={"Guardrails installed\nHarnesses inspected\nHoles covered"}
            className={inputClasses}
          />
        </div>

        {message && (
          <p
            className={`text-sm ${message.ok ? "text-green-500" : "text-red-400"}`}
          >
            {message.text}
          </p>
        )}

        <Button
          type="button"
          variant="accent"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Create Checklist"}
        </Button>
      </div>
    </div>
  );
}
