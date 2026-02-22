import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ComplianceChatForm } from "@/components/forms/compliance-chat-form";

export default async function AiChatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const history = await prisma.complianceChatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl text-text-primary">AI Compliance Chat</h2>
      <ComplianceChatForm />
      <div className="space-y-3">
        {history.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-secondary">Q: {entry.prompt}</p>
            <p className="mt-2 text-sm text-text-primary">A: {entry.response}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
