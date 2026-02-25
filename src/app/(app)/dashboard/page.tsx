import { TriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { MetricsCharts } from "@/components/dashboard/metrics-charts";

export default async function DashboardPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) {
    redirect("/login");
  }

  if (!context.companyId) {
    redirect("/onboarding");
  }

  const [user, incidents, checklists, sites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        name: true,
        role: true,
        company: { select: { name: true, sites: { select: { id: true, name: true } } } },
      },
    }),
    prisma.incident.findMany({
      where: { companyId: context.companyId },
      select: { createdAt: true, severity: true, site: { select: { name: true } } },
    }),
    prisma.checklist.count({ where: { companyId: context.companyId } }),
    prisma.site.findMany({ where: { companyId: context.companyId }, select: { id: true, name: true } }),
  ]);

  const openIssues = incidents.filter((item) => item.severity === "HIGH" || item.severity === "CRITICAL").length;
  const complianceScore = Math.max(0, Math.round(100 - openIssues * 7 + Math.min(20, checklists * 2)));

  const monthMap = new Map<string, number>();
  incidents.forEach((incident) => {
    const key = incident.createdAt.toISOString().slice(0, 7);
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  });

  const monthlyViolations = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, violations]) => ({ month, violations }));

  const siteRiskHeatmap = sites.map((site) => {
    const related = incidents.filter((entry) => entry.site.name === site.name);
    const score = related.reduce((acc, cur) => {
      const add = cur.severity === "CRITICAL" ? 30 : cur.severity === "HIGH" ? 20 : cur.severity === "MEDIUM" ? 10 : 5;
      return acc + add;
    }, 0);
    return { site: site.name, score: Math.min(100, score) };
  });

  const alerts = [
    openIssues > 0
      ? `${openIssues} High/Critical issues open. Repeat/willful exposure can reach $165,514.`
      : "No High/Critical issues open.",
    `Serious violations up to $16,550 each. Current compliance score: ${complianceScore}%`,
  ];

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-border/70 bg-surface/70 p-4 backdrop-blur sm:p-5">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">Executive Overview</p>
        <h2 className="mt-2 font-heading text-2xl text-text-primary">Compliance Overview</h2>
        <p className="mt-2 text-text-secondary">
          Welcome back, {user?.name ?? "team member"} ({user?.role}) at {user?.company?.name}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-border/70 bg-surface/70 p-3 backdrop-blur sm:p-4">
          <p className="text-xs text-text-secondary sm:text-sm">Compliance Score</p>
          <p className="font-data text-xl text-accent-cool sm:text-2xl">{complianceScore}%</p>
        </article>
        <article className="rounded-xl border border-border/70 bg-surface/70 p-3 backdrop-blur sm:p-4">
          <p className="text-xs text-text-secondary sm:text-sm">Open Issues</p>
          <p className="font-data text-xl text-accent-warm sm:text-2xl">{openIssues}</p>
        </article>
        <article className="rounded-xl border border-border/70 bg-surface/70 p-3 backdrop-blur sm:p-4">
          <p className="text-xs text-text-secondary sm:text-sm">Total Incidents</p>
          <p className="font-data text-xl text-text-primary sm:text-2xl">{incidents.length}</p>
        </article>
        <article className="rounded-xl border border-border/70 bg-surface/70 p-3 backdrop-blur sm:p-4">
          <p className="text-xs text-text-secondary sm:text-sm">Sites</p>
          <p className="font-data text-xl text-text-primary sm:text-2xl">{sites.length}</p>
        </article>
      </div>

      <MetricsCharts monthlyViolations={monthlyViolations} siteRiskHeatmap={siteRiskHeatmap} />

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl border border-border/70 bg-elevated/70 p-3 sm:p-4">
            <TriangleAlert suppressHydrationWarning className="mt-0.5 size-5 text-accent-warm" />
            <p className="text-sm text-text-secondary">{alert}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
