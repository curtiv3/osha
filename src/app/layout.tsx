import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "SafeSite — OSHA Compliance for Construction Crews",
    template: "%s | SafeSite",
  },
  description:
    "SafeSite helps small construction subcontractors stay OSHA-compliant with jobsite checklists, AI photo analysis, and compliance reports.",
  openGraph: {
    title: "SafeSite — OSHA Compliance for Construction Crews",
    description:
      "Jobsite checklists, AI risk analysis, and PDF compliance reports. Built for small crews, not enterprise safety departments.",
    type: "website",
    url: "/",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeSite — OSHA Compliance for Construction Crews",
    description:
      "Jobsite checklists, AI risk analysis, and PDF compliance reports. Built for small crews, not enterprise safety departments.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
