import { TriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const penalties = [
  { label: "Serious", value: "$16,550 / Verstoß" },
  { label: "Repeat/Willful", value: "$165,514 / Verstoß" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      role: true,
      companyId: true,
      company: {
        select: {
          name: true,
          sites: { select: { id: true, name: true } },
        },
      },
    },
  });

  const hasOnboarding = Boolean(user?.companyId && user.company?.sites.length);
  if (!hasOnboarding) {
    redirect("/onboarding");
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-text-primary">Compliance Übersicht</h2>
        <p className="mt-2 text-text-secondary">
          Willkommen {user?.name ?? "Teammitglied"} ({user?.role}) bei {user?.company?.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {penalties.map((item) => (
          <article key={item.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-secondary">{item.label}</p>
            <p className="mt-1 font-data text-xl text-accent-warm">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-text-secondary">Aktive Sites: {user?.company?.sites.map((site) => site.name).join(", ")}</p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-elevated p-4">
        <TriangleAlert className="mt-0.5 size-5 text-accent-warm" />
        <p className="text-sm text-text-secondary">
          Priorisiere hohe Risiken: Repeat/Willful-Strafen können bis zu $165,514 pro Verstoß betragen.
        </p>
      </div>
    </section>
  );
}
