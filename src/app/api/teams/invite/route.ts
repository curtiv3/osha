import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "SITE_MANAGER"]).default("SITE_MANAGER"),
});

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (context.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can invite team members." },
      { status: 403 },
    );
  }

  const payload = await request.json();
  const parsed = inviteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  // Check if user already in company
  const existingUser = await prisma.user.findFirst({
    where: { email: parsed.data.email, companyId: context.companyId },
  });
  if (existingUser) {
    return NextResponse.json(
      { error: "This person is already on your team." },
      { status: 409 },
    );
  }

  // Check for existing pending invite
  const existingInvite = await prisma.companyInvite.findFirst({
    where: {
      companyId: context.companyId,
      email: parsed.data.email,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
  if (existingInvite) {
    return NextResponse.json(
      { error: "An invite is already pending for this email." },
      { status: 409 },
    );
  }

  const invite = await prisma.companyInvite.create({
    data: {
      companyId: context.companyId,
      email: parsed.data.email,
      role: parsed.data.role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return NextResponse.json({ invite }, { status: 201 });
}
