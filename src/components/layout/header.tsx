import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-void/80 px-3 backdrop-blur sm:h-16 sm:px-6">
      <div>
        <p className="font-heading text-lg text-text-primary">SafeSite</p>
        <p className="hidden text-xs text-text-tertiary sm:block">
          OSHA Compliance for Construction
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden text-sm text-text-secondary transition hover:text-text-primary sm:inline"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="hidden rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary transition hover:bg-elevated sm:inline-flex"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}
