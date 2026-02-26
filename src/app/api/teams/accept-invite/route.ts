import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";

const schema = z.object({
  token: z.string().min(1),
});

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invite token." },
      { status: 400 },
    );
  }

  const invite = await prisma.companyInvite.findUnique({
    where: { token: parsed.data.token },
    include: { company: { select: { name: true } } },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found." }, { status: 404 });
  }

  if (invite.acceptedAt) {
    return NextResponse.json(
      { error: "This invite has already been used." },
      { status: 410 },
    );
  }

  if (invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This invite has expired." },
      { status: 410 },
    );
  }

  if (context.companyId) {
    return NextResponse.json(
      { error: "You already belong to a company." },
      { status: 409 },
    );
  }

  // Add user to company and mark invite as accepted
  await prisma.$transaction([
    prisma.user.update({
      where: { id: context.userId },
      data: { companyId: invite.companyId, role: invite.role },
    }),
    prisma.companyInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    companyName: invite.company.name,
  });
}
