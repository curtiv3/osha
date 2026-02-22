import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { onboardingSchema } from "@/lib/auth-schema";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = onboardingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid onboarding payload." }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name: parsed.data.companyName,
        users: {
          connect: { id: session.user.id },
        },
        sites: {
          create: parsed.data.sites.map((name) => ({ name })),
        },
      },
      select: { id: true },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        companyId: company.id,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not complete onboarding." }, { status: 500 });
  }
}
