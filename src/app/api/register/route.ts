import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/auth-schema";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Server configuration error: DATABASE_URL is missing." },
      { status: 500 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration payload." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        role: parsed.data.role,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    // Auto-join company if there is a pending invite for this email
    if (user.email) {
      const invite = await prisma.companyInvite.findFirst({
        where: {
          email: user.email,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (invite) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { companyId: invite.companyId, role: invite.role },
          }),
          prisma.companyInvite.update({
            where: { id: invite.id },
            data: { acceptedAt: new Date() },
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 409 },
        );
      }

      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          {
            error:
              "Database schema is not ready. Please run Prisma migrations.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to register user." },
      { status: 500 },
    );
  }
}
