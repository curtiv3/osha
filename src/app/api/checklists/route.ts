import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { oshaChecklistTemplates } from "@/lib/osha/default-checklists";

const createChecklistSchema = z.object({
  siteId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
});

export async function GET() {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checklists = await prisma.checklist.findMany({
    where: { companyId: context.companyId },
    include: { site: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ checklists, templates: oshaChecklistTemplates });
}

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createChecklistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checklist payload." }, { status: 400 });
  }


  const site = await prisma.site.findFirst({
    where: { id: parsed.data.siteId, companyId: context.companyId },
    select: { id: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Invalid site for this company." }, { status: 400 });
  }

  const checklist = await prisma.checklist.create({
    data: {
      companyId: context.companyId,
      siteId: parsed.data.siteId,
      title: parsed.data.title,
      description: parsed.data.description,
      items: parsed.data.items,
    },
  });

  return NextResponse.json({ checklist }, { status: 201 });
}
