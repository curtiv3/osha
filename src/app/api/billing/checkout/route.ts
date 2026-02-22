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
  if (!context.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true, email: true, stripeCustomerId: true },
  });

  if (!user?.email) {
    return NextResponse.json({ error: "User email is required for billing." }, { status: 400 });
  }

  const plan = BILLING_PLANS[parsed.data.plan];
  const priceId = process.env[plan.envPriceKey];
  if (!priceId) {
    return NextResponse.json({ error: `Missing ${plan.envPriceKey} env variable.` }, { status: 500 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
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
      userId: user.id,
      plan: parsed.data.plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
