"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = {
  key: "BASIC" | "PRO";
  name: string;
  priceMonthly: number;
  description: string;
};

export function PlanCards({ plans, currentTier }: { plans: Plan[]; currentTier: string }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(plan: "BASIC" | "PRO") {
    setError(null);
    setLoadingPlan(plan);

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string; url?: string } | null;
    if (!response.ok || !data?.url) {
      setLoadingPlan(null);
      setError(data?.error ?? "Checkout konnte nicht gestartet werden.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-accent-warm">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = currentTier === plan.key;
          return (
            <article key={plan.key} className="rounded-lg border border-border bg-surface p-4">
              <h3 className="font-heading text-xl text-text-primary">{plan.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">{plan.description}</p>
              <p className="mt-4 font-data text-2xl text-accent-cool">${plan.priceMonthly}/mo</p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant={isCurrent ? "outline" : "accent"}
                  disabled={isCurrent || loadingPlan === plan.key}
                  onClick={() => subscribe(plan.key)}
                >
                  {isCurrent ? "Aktiver Plan" : loadingPlan === plan.key ? "Weiterleitung…" : "Plan wählen"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
