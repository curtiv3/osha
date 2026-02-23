import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { LoginForm } from "@/components/forms/login-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Login for registered SafetyComplianceSaaS users.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent-cool/20 blur-3xl" />
      <section className="relative w-full max-w-md rounded-2xl border border-border/70 bg-surface/80 p-7 backdrop-blur">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">Welcome back</p>
        <h1 className="mt-2 font-heading text-2xl text-text-primary">Anmelden</h1>
        <p className="mt-2 text-sm text-text-secondary">Verwalte Risiken, Vorfälle und Compliance-Reports zentral in einem Workspace.</p>
        <LoginForm />
        <p className="mt-5 text-sm text-text-secondary">
          Noch kein Konto? <Link href="/register" className="text-accent-cool underline underline-offset-4">Registrieren</Link>
        </p>
      </section>
    </main>
  );
}
