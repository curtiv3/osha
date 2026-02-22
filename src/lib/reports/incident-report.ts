import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface IncidentReportData {
  incidentId: string;
  title: string;
  severity: string;
  siteName: string;
  reportedAt: string;
  details: string;
  aiAssessment: string;
  oshaPenaltyHint: string;
}

export async function buildIncidentReportPdf(data: IncidentReportData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { height } = page.getSize();

  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = height - 48;

  page.drawText("SafetyComplianceSaaS Incident Report", {
    x: 40,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.12, 0.12),
  });

  y -= 28;
  const headerLines = [
    `Incident ID: ${data.incidentId}`,
    `Title: ${data.title}`,
    `Severity: ${data.severity}`,
    `Site: ${data.siteName}`,
    `Reported at: ${data.reportedAt}`,
  ];

  for (const line of headerLines) {
    page.drawText(line, { x: 40, y, size: 11, font: fontRegular });
    y -= 18;
  }

  y -= 8;
  page.drawText("Incident Details", { x: 40, y, size: 13, font: fontBold });
  y -= 18;

  const detailsLines = wrapText(data.details || "No details provided.", 88);
  for (const line of detailsLines) {
    page.drawText(line, { x: 40, y, size: 10.5, font: fontRegular });
    y -= 14;
  }

  y -= 10;
  page.drawText("AI Risk Assessment", { x: 40, y, size: 13, font: fontBold });
  y -= 18;

  const assessmentLines = wrapText(data.aiAssessment || "No AI assessment available.", 88);
  for (const line of assessmentLines) {
    page.drawText(line, { x: 40, y, size: 10.5, font: fontRegular });
    y -= 14;
    if (y < 80) {
      break;
    }
  }

  y -= 10;
  page.drawText("Penalty Context", { x: 40, y, size: 13, font: fontBold });
  y -= 18;

  const penaltyLines = wrapText(data.oshaPenaltyHint, 88);
  for (const line of penaltyLines) {
    page.drawText(line, { x: 40, y, size: 10.5, font: fontRegular });
    y -= 14;
  }

  return pdf.save();
}

function wrapText(input: string, maxCharsPerLine: number): string[] {
  const words = input.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine) {
      if (current) {
        lines.push(current);
      }
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}
