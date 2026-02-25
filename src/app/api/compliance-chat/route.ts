import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { OSHA_COMPLIANCE_SYSTEM_PROMPT } from "@/lib/osha/knowledge-base";

const inputSchema = z.object({
  prompt: z.string().min(5),
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function getResponse(prompt: string) {
  if (!openai) {
    return "AI chat unavailable: OPENAI_API_KEY is missing. For urgent questions, reference OSHA's construction standards at 29 CFR 1926. Serious violations may incur up to $16,550 and willful/repeat up to $165,514.";
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: OSHA_COMPLIANCE_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    max_tokens: 800,
  });

  return completion.choices[0]?.message?.content || "No response generated.";
}

export async function GET() {
  const context = await getCurrentUserContext();
  if (!context.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.complianceChatMessage.findMany({
    where: { userId: context.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = inputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });
  }

  const response = await getResponse(parsed.data.prompt);

  const message = await prisma.complianceChatMessage.create({
    data: {
      userId: context.userId,
      companyId: context.companyId,
      prompt: parsed.data.prompt,
      response,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
