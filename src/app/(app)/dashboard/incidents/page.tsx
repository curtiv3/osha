import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { IncidentForm } from "@/components/forms/incident-form";

export default async function IncidentsPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");
  if (!context.companyId) redirect("/onboarding");

  const [sites, incidents] = await Promise.all([
    prisma.site.findMany({ where: { companyId: context.companyId }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.incident.findMany({ where: { companyId: context.companyId }, include: { site: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
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
            <div className="mt-3">
              <Link
                href={`/api/reports/incidents/${incident.id}`}
                className="text-sm text-accent-cool underline underline-offset-4"
              >
                PDF Report herunterladen
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
