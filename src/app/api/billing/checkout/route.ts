import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserContext } from "@/lib/auth-context";
import { stripe } from "@/lib/billing/stripe";
import { BILLING_PLANS } from "@/lib/billing/plans";

const schema = z.object({
  plan: z.enum(["BASIC", "PRO"]),
});

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (context.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only company admins can manage billing." },
      { status: 403 },
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 },
    );
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid plan payload." },
      { status: 400 },
    );
  }

  const company = await prisma.company.findUnique({
    where: { id: context.companyId },
    select: { id: true, name: true, stripeCustomerId: true },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { email: true },
  });

  if (!user?.email) {
    return NextResponse.json(
      { error: "User email is required for billing." },
      { status: 400 },
    );
  }

  const plan = BILLING_PLANS[parsed.data.plan];
  const priceId = process.env[plan.envPriceKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${plan.envPriceKey} env variable.` },
      { status: 500 },
    );
  }

  let customerId = company.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { companyId: company.id, companyName: company.name },
    });
    customerId = customer.id;

    await prisma.company.update({
      where: { id: company.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/billing?status=success`,
    cancel_url: `${baseUrl}/dashboard/billing?status=cancel`,
    metadata: {
      companyId: company.id,
      plan: parsed.data.plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
