import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { ComplianceChatForm } from "@/components/forms/compliance-chat-form";

export default async function AiChatPage() {
  const context = await getCurrentUserContext();
  if (!context.userId) redirect("/login");

  const history = await prisma.complianceChatMessage.findMany({
    where: { userId: context.userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl text-text-primary">
        AI Compliance Chat
      </h2>
      <ComplianceChatForm />
      <div className="space-y-3">
        {history.map((entry) => (
          <article
            key={entry.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <p className="text-sm font-medium text-text-primary">
              Q: {entry.prompt}
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">
              {entry.response}
            </p>
          </article>
        ))}
        {history.length === 0 && (
          <p className="text-sm text-text-tertiary">
            No chat history yet. Ask a question above.
          </p>
        )}
      </div>
    </section>
  );
}
