import { Resend } from "resend";

interface CriticalIncidentEmailInput {
  companyName: string;
  siteName: string;
  title: string;
  severity: "HIGH" | "CRITICAL";
  details?: string | null;
  aiAssessment?: string | null;
  incidentId: string;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendCriticalIncidentEmail(input: CriticalIncidentEmailInput): Promise<void> {
  const to = process.env.ALERT_EMAIL_TO;
  if (!resend || !to) {
    return;
  }

  const subject = `[SafetyComplianceSaaS] ${input.severity} incident: ${input.title}`;
  const penaltyText =
    input.severity === "CRITICAL"
      ? "Potential repeat/willful exposure can reach up to $165,514."
      : "Serious violations can reach $16,550 per violation/day.";

  await resend.emails.send({
    from: "alerts@safetycompliance.local",
    to,
    subject,
    text: [
      `Company: ${input.companyName}`,
      `Site: ${input.siteName}`,
      `Incident: ${input.title}`,
      `Severity: ${input.severity}`,
      `Incident ID: ${input.incidentId}`,
      "",
      `Details: ${input.details ?? "n/a"}`,
      "",
      `AI assessment: ${input.aiAssessment ?? "n/a"}`,
      "",
      penaltyText,
    ].join("\n"),
  });
}
