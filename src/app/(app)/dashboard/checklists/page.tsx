import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ChecklistForm } from "@/components/forms/checklist-form";

export default async function ChecklistsPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.companyId) redirect("/onboarding");

  const [sites, checklists] = await Promise.all([
    prisma.site.findMany({ where: { companyId: session.user.companyId }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.checklist.findMany({ where: { companyId: session.user.companyId }, include: { site: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl text-text-primary">Checklisten</h2>
      <ChecklistForm sites={sites} />
      <div className="space-y-3">
        {checklists.map((checklist) => (
          <article key={checklist.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-secondary">{checklist.site.name}</p>
            <h3 className="font-heading text-lg text-text-primary">{checklist.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
