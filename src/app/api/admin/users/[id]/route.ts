import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "SITE_MANAGER"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const payload = await request.json();
  const parsed = updateRoleSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role payload." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, role: true },
  });

  return NextResponse.json({ user });
}
