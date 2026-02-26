import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";

export async function GET() {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [incidents, checklists, sites] = await Promise.all([
    prisma.incident.findMany({ where: { companyId: context.companyId }, select: { createdAt: true, severity: true, site: { select: { name: true } } } }),
    prisma.checklist.count({ where: { companyId: context.companyId } }),
    prisma.site.findMany({ where: { companyId: context.companyId }, select: { id: true, name: true } }),
  ]);

  const openIssues = incidents.filter((item) => item.severity === "HIGH" || item.severity === "CRITICAL").length;
  const complianceScore = Math.max(0, Math.round(100 - openIssues * 7 + Math.min(20, checklists * 2)));

  const monthlyMap = new Map<string, number>();
  incidents.forEach((incident) => {
    const month = incident.createdAt.toISOString().slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + 1);
  });

  const monthlyViolations = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, violations]) => ({ month, violations }));

  const siteRiskHeatmap = sites.map((site) => {
    const related = incidents.filter((entry) => entry.site.name === site.name);
    const risk = related.reduce((acc, cur) => {
      const add = cur.severity === "CRITICAL" ? 30 : cur.severity === "HIGH" ? 20 : cur.severity === "MEDIUM" ? 10 : 5;
      return acc + add;
    }, 0);

    return { site: site.name, score: Math.min(100, risk) };
  });

  const alerts = [
    openIssues > 0
      ? `${openIssues} High/Critical issues open. Repeat/willful exposure can reach $165,514.`
      : "No High/Critical issues open.",
    `Serious violations up to $16,550 each. Current compliance score: ${complianceScore}%`,
  ];

  return NextResponse.json({
    complianceScore,
    openIssues,
    totalIncidents: incidents.length,
    siteCount: sites.length,
    monthlyViolations,
    siteRiskHeatmap,
    alerts,
  });
}
