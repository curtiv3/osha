import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { IncidentForm } from "@/components/forms/incident-form";

export default async function IncidentsPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.companyId) redirect("/onboarding");

  const [sites, incidents] = await Promise.all([
    prisma.site.findMany({ where: { companyId: session.user.companyId }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.incident.findMany({ where: { companyId: session.user.companyId }, include: { site: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl text-text-primary">Audit & Incident Reporting</h2>
      <IncidentForm sites={sites} />
      <div className="space-y-3">
        {incidents.map((incident) => (
          <article key={incident.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-secondary">{incident.site.name} · {incident.severity}</p>
            <h3 className="font-heading text-lg text-text-primary">{incident.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{incident.aiAssessment ?? "No AI assessment yet."}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
