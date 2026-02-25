import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { sendCriticalIncidentEmail } from "@/lib/notifications/critical-incident-email";

const incidentSchema = z.object({
  siteId: z.string().min(1),
  title: z.string().min(3),
  details: z.string().min(3),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  imageUrl: z.string().optional(),
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const OSHA_SYSTEM_PROMPT = `You are an OSHA construction safety compliance expert. Analyze the reported incident and any attached photo. Provide a structured assessment:

1. **Hazard Classification**: Identify the hazard type — fall, struck-by, electrocution, caught-in/between, or other.

2. **Applicable OSHA Standard**: Reference specific 29 CFR 1926 subparts:
   - Fall Protection: 29 CFR 1926.501
   - Scaffolding: 29 CFR 1926.451
   - Ladders: 29 CFR 1926.1053
   - Electrical: 29 CFR 1926.405
   - Head Protection: 29 CFR 1926.100
   - Hazard Communication: 29 CFR 1926.59
   - Excavations: 29 CFR 1926.651
   - Stairways: 29 CFR 1926.1052

3. **Violation Severity**: Serious, Other-than-Serious, Willful, or Repeat.

4. **Potential Penalty**: Serious violations up to $16,550/violation. Willful/repeat up to $165,514.

5. **Recommended Actions**: Specific, actionable steps to fix the hazard immediately.

If a photo is provided, analyze it for visible safety violations: missing PPE, fall hazards, electrical hazards, improper scaffolding, housekeeping issues, and any other OSHA-relevant concerns.

Be specific. Reference actual standards. Keep the response concise and actionable — this will be read by a foreman on a phone screen.`;

async function generateAssessment(input: z.infer<typeof incidentSchema>) {
  if (!openai) {
    return "AI assessment unavailable: OPENAI_API_KEY not configured. Prioritize immediate supervisor review for high/critical incidents.";
  }

  const userContent: OpenAI.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `Incident Report:\n- Title: ${input.title}\n- Details: ${input.details}\n- Severity reported: ${input.severity}`,
    },
  ];

  if (input.imageUrl) {
    userContent.push({
      type: "image_url",
      image_url: { url: input.imageUrl, detail: "high" },
    });
  }

  const model = input.imageUrl ? "gpt-4o" : "gpt-4o-mini";

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: OSHA_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || "No AI assessment generated.";
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
    return NextResponse.json(
      { error: "Invalid incident payload." },
      { status: 400 },
    );
  }

  const site = await prisma.site.findFirst({
    where: { id: parsed.data.siteId, companyId: context.companyId },
    select: { id: true, name: true, company: { select: { name: true } } },
  });

  if (!site) {
    return NextResponse.json(
      { error: "Invalid site for this company." },
      { status: 400 },
    );
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

  if (incident.severity === "HIGH" || incident.severity === "CRITICAL") {
    try {
      await sendCriticalIncidentEmail({
        companyName: site.company.name,
        siteName: site.name,
        title: incident.title,
        severity: incident.severity,
        details: incident.details,
        aiAssessment: incident.aiAssessment,
        incidentId: incident.id,
      });
    } catch (error) {
      console.error("Failed to send critical incident alert email", error);
    }
  }

  return NextResponse.json({ incident }, { status: 201 });
}
