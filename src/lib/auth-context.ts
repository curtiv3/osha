import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserContext() {
  const session = await auth();
  if (!session?.user?.id) {
    return { userId: null, companyId: null, role: null as null | "ADMIN" | "SITE_MANAGER" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, companyId: true, role: true },
  });

  if (!user) {
    return { userId: null, companyId: null, role: null as null | "ADMIN" | "SITE_MANAGER" };
  }

  return { userId: user.id, companyId: user.companyId, role: user.role };
}
