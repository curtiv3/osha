import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/auth-context";
import { prisma } from "@/lib/prisma";
import { buildIncidentReportPdf } from "@/lib/reports/incident-report";

export async function GET(_: Request, { params }: { params: Promise<{ incidentId: string }> }) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { incidentId } = await params;

  const incident = await prisma.incident.findFirst({
    where: { id: incidentId, companyId: context.companyId },
    include: {
      site: { select: { name: true } },
      company: { select: { name: true } },
    },
  });

  if (!incident) {
    return NextResponse.json({ error: "Incident not found." }, { status: 404 });
  }

  const pdfBytes = await buildIncidentReportPdf({
    incidentId: incident.id,
    title: incident.title,
    severity: incident.severity,
    siteName: incident.site.name,
    reportedAt: incident.createdAt.toISOString(),
    details: incident.details ?? "",
    aiAssessment: incident.aiAssessment ?? "",
    oshaPenaltyHint:
      incident.severity === "HIGH" || incident.severity === "CRITICAL"
        ? "High/critical incidents may map to serious OSHA penalties of $16,550 and repeat/willful exposure up to $165,514."
        : "Even lower-severity incidents should be remediated early to avoid escalation into serious OSHA penalties.",
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="incident-${incident.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
