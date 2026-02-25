import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { TeamInviteForm } from "@/components/forms/team-invite-form";

export default async function TeamPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");
  if (!context.companyId) redirect("/onboarding");

  const [company, members, pendingInvites] = await Promise.all([
    prisma.company.findUnique({
      where: { id: context.companyId },
      select: { name: true, subscriptionTier: true },
    }),
    prisma.user.findMany({
      where: { companyId: context.companyId },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.companyInvite.findMany({
      where: {
        companyId: context.companyId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, email: true, role: true, expiresAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isAdmin = context.role === "ADMIN";

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-text-primary">Team</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {company?.name} · {members.length} member
          {members.length !== 1 ? "s" : ""} ·{" "}
          <span className="font-data">{company?.subscriptionTier}</span> plan
        </p>
      </div>

      {isAdmin && <TeamInviteForm />}

      {/* Members */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-text-tertiary">
          Members
        </h3>
        <div className="overflow-hidden rounded-lg border border-border">
          {members.map((member, i) => (
            <div
              key={member.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i % 2 === 0 ? "bg-elevated" : "bg-surface"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {member.name ?? member.email}
                </p>
                {member.name && (
                  <p className="text-xs text-text-tertiary">{member.email}</p>
                )}
              </div>
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                {member.role === "ADMIN" ? "Admin" : "Site Manager"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-text-tertiary">
            Pending Invites
          </h3>
          <div className="overflow-hidden rounded-lg border border-border">
            {pendingInvites.map((invite, i) => (
              <div
                key={invite.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  i % 2 === 0 ? "bg-elevated" : "bg-surface"
                }`}
              >
                <div>
                  <p className="text-sm text-text-primary">{invite.email}</p>
                  <p className="text-xs text-text-tertiary">
                    Expires{" "}
                    {invite.expiresAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
