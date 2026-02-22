"use client";

import "client-only";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthlyViolationPoint {
  month: string;
  violations: number;
}

interface SiteRiskPoint {
  site: string;
  score: number;
}

export function MetricsCharts({
  monthlyViolations,
  siteRiskHeatmap,
}: {
  monthlyViolations: MonthlyViolationPoint[];
  siteRiskHeatmap: SiteRiskPoint[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-lg border border-border bg-surface p-4">
        <h3 className="font-heading text-lg text-text-primary">Violations pro Monat</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyViolations}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="month" stroke="hsl(var(--color-text-tertiary))" />
              <YAxis stroke="hsl(var(--color-text-tertiary))" />
              <Tooltip />
              <Bar dataKey="violations" fill="hsl(var(--color-accent-cool))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-lg border border-border bg-surface p-4">
        <h3 className="font-heading text-lg text-text-primary">Risk Heatmap nach Site</h3>
        <div className="mt-4 space-y-3">
          {siteRiskHeatmap.map((point) => (
            <div key={point.site}>
              <div className="mb-1 flex items-center justify-between text-sm text-text-secondary">
                <span>{point.site}</span>
                <span className="font-data">{point.score}%</span>
              </div>
              <div className="h-2 rounded bg-elevated">
                <div
                  className="h-2 rounded bg-accent-warm"
                  style={{ width: `${Math.min(100, Math.max(0, point.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
