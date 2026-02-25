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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-accent-cool/15 blur-3xl" />
      <section className="relative w-full max-w-md rounded-2xl border border-border/70 bg-surface/80 p-5 backdrop-blur sm:max-w-3xl sm:p-7">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">Step 1 of 1</p>
        <h1 className="mt-2 font-heading text-2xl text-text-primary sm:text-3xl">Workspace Onboarding</h1>
        <p className="mt-2 text-text-secondary">Set up your company and job sites so your team can start with checklists, audits, and alerts right away.</p>
        <OnboardingForm />
      </section>
    </main>
  );
}
