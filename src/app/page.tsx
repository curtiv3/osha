import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ChartNoAxesCombined, ShieldCheck, Siren } from "lucide-react";

const stats = [
  { label: "Serious Violation", value: "$16,550" },
  { label: "Repeat/Willful", value: "$165,514" },
  { label: "Setup-Zeit", value: "< 30 Min" },
];

const features = [
  {
    title: "OSHA Checklisten & Audits",
    description: "Standardisierte Baustellen-Checks mit klaren Verantwortlichkeiten für Teams vor Ort.",
    icon: ShieldCheck,
  },
  {
    title: "AI Risikoanalyse",
    description: "Vorfälle inkl. Foto/Details bewerten und direkt Prioritäten mit Maßnahmenplan ableiten.",
    icon: Siren,
  },
  {
    title: "Live Dashboard & Reports",
    description: "Compliance-Score, offene Risiken, Monats-Trends und PDF-Exports für Stakeholder.",
    icon: ChartNoAxesCombined,
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-void">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-36 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent-cool/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-dream/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-10">
        <header className="mb-16 flex items-center justify-between rounded-2xl border border-border/60 bg-surface/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Building2 className="size-4 text-accent-cool" />
            SafetyComplianceSaaS
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-text-secondary transition hover:text-text-primary">
              Login
            </Link>
            <Link href="/register" className="rounded-lg bg-accent-cool px-3 py-1.5 font-medium text-void transition hover:opacity-90">
              Demo starten
            </Link>
          </div>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-xs text-text-secondary">
              <BadgeCheck className="size-3.5 text-accent-cool" />
              OSHA-ready workflows for construction managers
            </p>
            <h1 className="mt-6 font-heading text-4xl leading-tight text-text-primary sm:text-5xl">
              Weniger OSHA-Risiko.
              <span className="block text-accent-cool">Mehr Kontrolle auf jeder Baustelle.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
              SafetyComplianceSaaS kombiniert Checklisten, AI-Risikoanalysen, Reports und Alerts in einer
              Plattform – damit dein Team Verstöße früh erkennt und teure Strafen vermeidet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-cool px-5 py-3 text-sm font-semibold text-void transition hover:opacity-90"
              >
                Jetzt starten <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl border border-border bg-surface/70 px-5 py-3 text-sm font-medium text-text-primary transition hover:bg-elevated"
              >
                Zum Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface/70 p-6 backdrop-blur">
            <p className="text-sm text-text-secondary">Penalty Exposure Snapshot</p>
            <div className="mt-4 grid gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 bg-elevated/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-text-tertiary">{item.label}</p>
                  <p className="mt-1 font-data text-2xl text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-border/70 bg-surface/70 p-6 backdrop-blur">
                <Icon className="size-5 text-accent-cool" />
                <h2 className="mt-4 font-heading text-xl text-text-primary">{feature.title}</h2>
                <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
