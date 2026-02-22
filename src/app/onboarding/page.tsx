import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "@/components/forms/onboarding-form";


export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete company and site setup before using the dashboard.",
  robots: { index: false, follow: false },
};
export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      companyId: true,
      company: {
        select: {
          sites: { select: { id: true }, take: 1 },
        },
      },
    },
  });

  const hasOnboarding = Boolean(user?.companyId && user.company?.sites.length);
  if (hasOnboarding) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-6 py-10">
      <section className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6">
        <h1 className="font-heading text-3xl text-text-primary">Onboarding</h1>
        <p className="mt-2 text-text-secondary">Lege deine Firma und mindestens eine Baustelle an, um mit Compliance-Tracking zu starten.</p>
        <OnboardingForm />
      </section>
    </main>
  );
}
