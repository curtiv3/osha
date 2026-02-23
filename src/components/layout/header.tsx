import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-void/80 px-6 backdrop-blur">
      <div>
        <p className="font-heading text-lg text-text-primary">SafetyComplianceSaaS</p>
        <p className="text-xs text-text-tertiary">OSHA Risk Control Workspace</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-text-secondary transition hover:text-text-primary">
          Landing
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary transition hover:bg-elevated">
          Dashboard
        </Link>
      </div>
    </header>
  );
}
