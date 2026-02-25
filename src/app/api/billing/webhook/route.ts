import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/billing/stripe";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook not configured." },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = String(subscription.customer);

    const status = subscription.status;
    const priceId = subscription.items.data[0]?.price.id ?? null;

    const tier =
      priceId && priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
        ? "PRO"
        : priceId && priceId === process.env.STRIPE_PRICE_BASIC_MONTHLY
          ? "BASIC"
          : "FREE";

    await prisma.company.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        subscriptionStatus: status,
        subscriptionTier: tier,
        stripePriceId: priceId,
      },
    });
  }

  return NextResponse.json({ received: true });
}
