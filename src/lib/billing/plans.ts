export const BILLING_PLANS = {
  BASIC: {
    key: "BASIC",
    name: "Basic",
    priceMonthly: 29,
    description: "Checklisten und Basis-Compliance-Tracking",
    // Stripe product/price mapping in production:
    // product: prod_basic
    // monthly price: STRIPE_PRICE_BASIC_MONTHLY
    envPriceKey: "STRIPE_PRICE_BASIC_MONTHLY",
  },
  PRO: {
    key: "PRO",
    name: "Pro",
    priceMonthly: 99,
    description: "AI + Teams + unbegrenzte Sites",
    // Stripe product/price mapping in production:
    // product: prod_pro
    // monthly price: STRIPE_PRICE_PRO_MONTHLY
    envPriceKey: "STRIPE_PRICE_PRO_MONTHLY",
  },
} as const;

export type BillingPlanKey = keyof typeof BILLING_PLANS;
