import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { oshaChecklistTemplates } from "@/lib/osha/default-checklists";
import { UserManagement } from "@/components/admin/user-management";
import { TemplateEditor } from "@/components/admin/template-editor";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin panel for SafeSite.",
  robots: { index: false, follow: false },
};

const CONTENT_KEY = "OSHA_CHECKLIST_TEMPLATES";

export default async function AdminPage() {
  await requireAdmin();

  const [users, templateContent, usersCount, companiesCount, incidentsCount, highRiskIncidents, aiChats] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.adminContent.findUnique({ where: { key: CONTENT_KEY } }),
    prisma.user.count(),
    prisma.company.count(),
    prisma.incident.count(),
    prisma.incident.count({ where: { severity: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.complianceChatMessage.count(),
  ]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">Admin Console</p>
        <h2 className="mt-2 font-heading text-2xl text-text-primary">Admin Panel</h2>
        <p className="mt-2 text-text-secondary">Manage users, OSHA content, and platform analytics.</p>
      </div>

      <AnalyticsPanel
        data={{
          users: usersCount,
          companies: companiesCount,
          incidents: incidentsCount,
          highRiskIncidents,
          aiChats,
          conversionHint: companiesCount > 0 ? Math.round((usersCount / companiesCount) * 100) / 100 : 0,
        }}
      />

      <UserManagement initialUsers={users} />
      <TemplateEditor initialTemplates={templateContent?.value ?? oshaChecklistTemplates} />
    </section>
  );
}
