import { z } from "zod";

export const onboardingSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  sites: z.array(z.string().min(2, "Site name must contain at least 2 characters.")).min(1, "At least one site is required."),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required."),
  role: z.enum(["ADMIN", "SITE_MANAGER"]).default("SITE_MANAGER"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
