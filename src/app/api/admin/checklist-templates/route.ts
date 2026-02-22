import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { oshaChecklistTemplates } from "@/lib/osha/default-checklists";

const schema = z.object({
  templates: z.array(
    z.object({
      title: z.string().min(2),
      description: z.string().min(2),
      items: z.array(z.string().min(1)).min(1),
    }),
  ),
});

const KEY = "OSHA_CHECKLIST_TEMPLATES";

export async function GET() {
  await requireAdmin();

  const content = await prisma.adminContent.findUnique({ where: { key: KEY } });
  return NextResponse.json({ templates: (content?.value as unknown[]) ?? oshaChecklistTemplates });
}

export async function PUT(request: Request) {
  await requireAdmin();

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid template payload." }, { status: 400 });
  }

  const saved = await prisma.adminContent.upsert({
    where: { key: KEY },
    update: { value: parsed.data.templates },
    create: { key: KEY, value: parsed.data.templates },
  });

  return NextResponse.json({ id: saved.id, templates: saved.value });
}
