import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <h1 className="font-heading text-4xl text-text-primary">SafetyComplianceSaaS</h1>
        <p className="max-w-2xl text-text-secondary">
          Vermeide OSHA-Verstöße auf Baustellen mit strukturierten Checklisten, AI-Risikobewertungen und
          klaren Prioritäten für dein Team.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-elevated px-4 py-2 text-sm text-accent-cool transition hover:bg-surface"
          >
            Zum Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
