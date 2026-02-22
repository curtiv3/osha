import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";

const incidentSchema = z.object({
  siteId: z.string().min(1),
  title: z.string().min(3),
  details: z.string().min(3),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  imageUrl: z.string().url().optional(),
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function generateAssessment(input: z.infer<typeof incidentSchema>) {
  if (!openai) {
    return "AI assessment unavailable: OPENAI_API_KEY not configured. Prioritize immediate supervisor review for high/critical incidents.";
  }

  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `You are an OSHA compliance assistant. Incident title: ${input.title}. Details: ${input.details}. Severity: ${input.severity}. Image URL: ${input.imageUrl ?? "n/a"}. Provide a short risk assessment and mitigation actions. Include mention of potential serious ($16,550) and repeat/willful ($165,514) exposure when relevant.`,
  });

  return completion.output_text || "No AI assessment generated.";
}

export async function GET() {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incidents = await prisma.incident.findMany({
    where: { companyId: context.companyId },
    include: { site: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ incidents });
}

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = incidentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid incident payload." }, { status: 400 });
  }

  const site = await prisma.site.findFirst({
    where: { id: parsed.data.siteId, companyId: context.companyId },
    select: { id: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Invalid site for this company." }, { status: 400 });
  }

  const aiAssessment = await generateAssessment(parsed.data);

  const incident = await prisma.incident.create({
    data: {
      companyId: context.companyId,
      siteId: parsed.data.siteId,
      reportedById: context.userId,
      title: parsed.data.title,
      details: parsed.data.details,
      severity: parsed.data.severity,
      imageUrl: parsed.data.imageUrl,
      aiAssessment,
    },
  });

  return NextResponse.json({ incident }, { status: 201 });
}
