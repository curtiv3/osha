import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { ChecklistForm } from "@/components/forms/checklist-form";
import { oshaChecklistTemplates } from "@/lib/osha/default-checklists";

export default async function ChecklistsPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");
  if (!context.companyId) redirect("/onboarding");

  const [sites, checklists] = await Promise.all([
    prisma.site.findMany({
      where: { companyId: context.companyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.checklist.findMany({
      where: { companyId: context.companyId },
      include: { site: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="space-y-4 sm:space-y-6">
      <h2 className="font-heading text-xl text-text-primary sm:text-2xl">Checklists</h2>
      <ChecklistForm sites={sites} templates={oshaChecklistTemplates} />
      <div className="space-y-3">
        {checklists.map((checklist) => (
          <article
            key={checklist.id}
            className="rounded-lg border border-border bg-surface p-3 sm:p-4"
          >
            <p className="text-sm text-text-secondary">
              {checklist.site.name}
            </p>
            <h3 className="font-heading text-lg text-text-primary">
              {checklist.title}
            </h3>
            {checklist.description && (
              <p className="mt-1 text-sm text-text-tertiary">
                {checklist.description}
              </p>
            )}
          </article>
        ))}
        {checklists.length === 0 && (
          <p className="text-sm text-text-tertiary">
            No checklists yet. Pick an OSHA template above to get started.
          </p>
        )}
      </div>
    </section>
  );
}
