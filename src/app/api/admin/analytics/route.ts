import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  await requireAdmin();

  const [users, companies, incidents, highRiskIncidents, aiChats] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.incident.count(),
    prisma.incident.count({ where: { severity: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.complianceChatMessage.count(),
  ]);

  return NextResponse.json({
    users,
    companies,
    incidents,
    highRiskIncidents,
    aiChats,
    conversionHint: companies > 0 ? Math.round((users / companies) * 100) / 100 : 0,
  });
}
