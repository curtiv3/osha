import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forbidden",
  description: "You do not have access to this section.",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-wide text-text-secondary">403</p>
      <h1 className="mt-2 font-heading text-3xl text-text-primary">Access Denied</h1>
      <p className="mt-4 text-text-secondary">
        Your account does not have admin privileges. If this is an error, please contact an administrator.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md border border-border bg-surface px-4 py-2 text-sm text-text-primary transition hover:bg-elevated"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}
