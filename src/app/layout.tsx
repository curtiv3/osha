import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "SafetyComplianceSaaS",
    template: "%s | SafetyComplianceSaaS",
  },
  description:
    "SafetyComplianceSaaS hilft Baustellen-Managern OSHA-Verstöße zu vermeiden mit Checklisten, Risikoanalysen und Compliance-Reports.",
  openGraph: {
    title: "SafetyComplianceSaaS",
    description:
      "OSHA Compliance Plattform für Baustellen-Teams mit AI-Risikoanalysen, Audits und Echtzeit-Alerts.",
    type: "website",
    url: "/",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SafetyComplianceSaaS",
    description:
      "OSHA Compliance Plattform für Baustellen-Teams mit AI-Risikoanalysen, Audits und Echtzeit-Alerts.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
