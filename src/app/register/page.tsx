import type { Metadata } from "next";
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
    <main className="flex min-h-screen items-center justify-center bg-void px-6">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
        <h1 className="font-heading text-2xl text-text-primary">Registrieren</h1>
        <p className="mt-2 text-sm text-text-secondary">Erstelle einen Account als Admin oder Site Manager.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
