import type { Metadata } from "next";
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
    <main className="flex min-h-screen items-center justify-center bg-void px-6">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
        <h1 className="font-heading text-2xl text-text-primary">Anmelden</h1>
        <p className="mt-2 text-sm text-text-secondary">Logge dich ein, um OSHA-Compliance-Daten für deine Baustellen zu verwalten.</p>
        <LoginForm />
      </section>
    </main>
  );
}
