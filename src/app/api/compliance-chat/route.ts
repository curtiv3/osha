import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  prompt: z.string().min(5),
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function getResponse(prompt: string) {
  if (!openai) {
    return "AI chat unavailable: OPENAI_API_KEY is missing. Serious violations may incur up to $16,550 and repeat/willful up to $165,514.";
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `You are SafetyComplianceSaaS OSHA compliance assistant. Answer clearly and briefly. User prompt: ${prompt}`,
  });

  return response.output_text || "No response generated.";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.complianceChatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
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
      userId: session.user.id,
      companyId: session.user.companyId,
      prompt: parsed.data.prompt,
      response,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
