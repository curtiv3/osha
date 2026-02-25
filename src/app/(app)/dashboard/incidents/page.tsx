import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { IncidentForm } from "@/components/forms/incident-form";

const severityColor: Record<string, string> = {
  LOW: "text-text-secondary",
  MEDIUM: "text-accent-warm",
  HIGH: "text-red-400",
  CRITICAL: "text-red-500 font-bold",
};

export default async function IncidentsPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");
  if (!context.companyId) redirect("/onboarding");

  const [sites, incidents] = await Promise.all([
    prisma.site.findMany({
      where: { companyId: context.companyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.incident.findMany({
      where: { companyId: context.companyId },
      include: { site: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="space-y-4 sm:space-y-6">
      <h2 className="font-heading text-xl text-text-primary sm:text-2xl">
        Incident Reporting
      </h2>
      <IncidentForm sites={sites} />
      <div className="space-y-3">
        {incidents.map((incident) => (
          <article
            key={incident.id}
            className="rounded-lg border border-border bg-surface p-3 sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-secondary">
                  {incident.site.name} ·{" "}
                  <span className={severityColor[incident.severity] ?? ""}>
                    {incident.severity}
                  </span>
                </p>
                <h3 className="font-heading text-lg text-text-primary">
                  {incident.title}
                </h3>
                {incident.details && (
                  <p className="mt-1 text-sm text-text-tertiary">
                    {incident.details}
                  </p>
                )}
              </div>
              {incident.imageUrl && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={incident.imageUrl}
                    alt="Incident photo"
                    className="h-20 w-20 rounded-md border border-border object-cover"
                  />
                </div>
              )}
            </div>
            {incident.aiAssessment && (
              <div className="mt-3 rounded-md border border-border bg-elevated p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent-warm">
                  AI Safety Assessment
                </p>
                <p className="whitespace-pre-line text-sm text-text-secondary">
                  {incident.aiAssessment}
                </p>
              </div>
            )}
            <div className="mt-3">
              <Link
                href={`/api/reports/incidents/${incident.id}`}
                className="text-sm text-accent-cool underline underline-offset-4"
              >
                Download PDF Report
              </Link>
            </div>
          </article>
        ))}
        {incidents.length === 0 && (
          <p className="text-sm text-text-tertiary">
            No incidents reported yet.
          </p>
        )}
      </div>
    </section>
  );
}
