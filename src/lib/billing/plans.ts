export const BILLING_PLANS = {
  BASIC: {
    key: "BASIC",
    name: "Basic",
    priceMonthly: 29,
    description: "Checklists, incident logging, and compliance tracking for one crew.",
    envPriceKey: "STRIPE_PRICE_BASIC_MONTHLY",
  },
  PRO: {
    key: "PRO",
    name: "Pro",
    priceMonthly: 99,
    description: "AI photo analysis, unlimited sites, PDF reports, team accounts.",
    envPriceKey: "STRIPE_PRICE_PRO_MONTHLY",
  },
} as const;

export type BillingPlanKey = keyof typeof BILLING_PLANS;
