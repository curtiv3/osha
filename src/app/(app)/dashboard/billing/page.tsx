import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { BILLING_PLANS } from "@/lib/billing/plans";
import { PlanCards } from "@/components/billing/plan-cards";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage billing plans and subscriptions.",
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");
  if (!context.companyId) redirect("/onboarding");

  const company = await prisma.company.findUnique({
    where: { id: context.companyId },
    select: { subscriptionTier: true, subscriptionStatus: true },
  });

  const plans = [BILLING_PLANS.BASIC, BILLING_PLANS.PRO];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-text-primary">Billing</h2>
        <p className="mt-2 text-text-secondary">
          Status:{" "}
          <span className="font-data">
            {company?.subscriptionStatus ?? "inactive"}
          </span>{" "}
          · Plan:{" "}
          <span className="font-data">
            {company?.subscriptionTier ?? "FREE"}
          </span>
        </p>
        <p className="mt-1 text-xs text-text-tertiary">
          Your subscription applies to everyone on your team.
        </p>
      </div>

      <PlanCards
        plans={plans}
        currentTier={company?.subscriptionTier ?? "FREE"}
        isAdmin={context.role === "ADMIN"}
      />
    </section>
  );
}
