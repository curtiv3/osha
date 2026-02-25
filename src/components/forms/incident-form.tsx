"use client";

import "client-only";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SiteOption {
  id: string;
  name: string;
}

export function IncidentForm({ sites }: { sites: SiteOption[] }) {
  const router = useRouter();
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error ?? "Upload failed.", ok: false });
        setImagePreview(null);
        return;
      }
      setImageUrl(data.url);
    } catch {
      setMessage({ text: "Upload failed. Please try again.", ok: false });
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submit() {
    setMessage(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          title,
          details,
          severity,
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        setMessage({ text: data?.error ?? "Failed to save incident.", ok: false });
        return;
      }

      setMessage({ text: "Incident saved. AI analysis complete.", ok: true });
      setTitle("");
      setDetails("");
      setImageUrl(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary placeholder:text-text-tertiary";

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">
        Report Incident
      </h3>
      <div className="mt-4 grid gap-4">
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
            placeholder="e.g. Missing guardrail on 2nd floor"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe what you observed..."
            className={inputClasses}
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className={inputClasses}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Photo upload */}
        <div>
          <label className="text-sm font-medium text-text-secondary">
            Photo (optional)
          </label>
          {imagePreview ? (
            <div className="relative mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 w-full rounded-md border border-border object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-elevated/80 px-2 py-1 text-xs text-text-primary hover:bg-red-600"
              >
                Remove
              </button>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-void/60">
                  <span className="text-sm text-text-primary">
                    Uploading...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-elevated px-4 py-8 text-center transition-colors hover:border-accent-warm"
            >
              <svg
                className="mb-2 h-8 w-8 text-text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
              <span className="text-sm text-text-secondary">
                Tap to take photo or choose file
              </span>
              <span className="mt-1 text-xs text-text-tertiary">
                JPEG, PNG, WebP — max 10MB
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
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
          disabled={submitting || uploading}
        >
          {submitting ? "Analyzing..." : "Submit & Analyze"}
        </Button>
      </div>
    </div>
  );
}
