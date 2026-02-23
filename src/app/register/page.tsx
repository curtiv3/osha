import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/forms/register-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account for SafetyComplianceSaaS.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-12">
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-dream/20 blur-3xl" />
      <section className="relative w-full max-w-md rounded-2xl border border-border/70 bg-surface/80 p-7 backdrop-blur">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">Get started</p>
        <h1 className="mt-2 font-heading text-2xl text-text-primary">Registrieren</h1>
        <p className="mt-2 text-sm text-text-secondary">Lege deinen Account an und starte mit einem klaren OSHA-Compliance-Setup.</p>
        <RegisterForm />
        <p className="mt-5 text-sm text-text-secondary">
          Bereits registriert? <Link href="/login" className="text-accent-cool underline underline-offset-4">Zum Login</Link>
        </p>
      </section>
    </main>
  );
}
