import { TriangleAlert } from "lucide-react";

const penalties = [
  { label: "Serious", value: "$16,550 / Verstoß" },
  { label: "Repeat/Willful", value: "$165,514 / Verstoß" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-text-primary">Compliance Übersicht</h2>
        <p className="mt-2 text-text-secondary">Aktuelle OSHA-Strafrahmen als Basis für Risiko-Priorisierung.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {penalties.map((item) => (
          <article key={item.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-secondary">{item.label}</p>
            <p className="mt-1 font-data text-xl text-accent-warm">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-elevated p-4">
        <TriangleAlert className="mt-0.5 size-5 text-accent-warm" />
        <p className="text-sm text-text-secondary">
          Phase 0 abgeschlossen: Boilerplate, Auth-Grundlage und Datenmodell sind vorbereitet.
        </p>
      </div>
    </section>
  );
}
