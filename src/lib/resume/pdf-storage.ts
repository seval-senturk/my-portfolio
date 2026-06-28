import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const RESUME_PUBLIC_DIR = path.join(process.cwd(), "public", "resume");

const DEFAULT_PDF_FILENAME = "seval-senturk-resume-en.pdf";

/** Minimal valid PDF 1.1 document (placeholder until admin uploads a real CV). */
const MINIMAL_PDF_BYTES = Buffer.from(
  [
    "%PDF-1.1",
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj",
    "4 0 obj<< /Length 55 >>stream",
    "BT /F1 18 Tf 72 720 Td (Resume PDF placeholder - replace via admin) Tj ET",
    "endstream endobj",
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
    "xref",
    "0 6",
    "0000000000 65535 f ",
    "0000000009 00000 n ",
    "0000000058 00000 n ",
    "0000000115 00000 n ",
    "0000000266 00000 n ",
    "0000000375 00000 n ",
    "trailer<< /Size 6 /Root 1 0 R >>",
    "startxref",
    "456",
    "%%EOF",
  ].join("\n"),
  "utf8",
);

export function sanitizeResumePdfFilename(originalName: string): string {
  const base = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "-");
  const lower = base.toLowerCase();

  if (lower.endsWith(".pdf")) {
    return lower;
  }

  return `${lower || DEFAULT_PDF_FILENAME.replace(".pdf", "")}.pdf`;
}

export function getResumePdfPublicPath(fileName: string): string {
  return `/resume/${fileName}`;
}

export async function ensureDefaultResumePdfExists(): Promise<string> {
  await mkdir(RESUME_PUBLIC_DIR, { recursive: true });
  const fileName = DEFAULT_PDF_FILENAME;
  const absolutePath = path.join(RESUME_PUBLIC_DIR, fileName);

  try {
    await writeFile(absolutePath, MINIMAL_PDF_BYTES, { flag: "wx" });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EEXIST") {
      throw error;
    }
  }

  return getResumePdfPublicPath(fileName);
}

export async function saveResumePdfFile(
  buffer: Buffer,
  originalName: string,
): Promise<{ filePath: string; fileName: string }> {
  if (buffer.length === 0) {
    throw new Error("PDF file is empty.");
  }

  if (buffer.length > 20 * 1024 * 1024) {
    throw new Error("PDF exceeds maximum size of 20MB.");
  }

  const header = buffer.subarray(0, 5).toString("utf8");
  if (!header.startsWith("%PDF-")) {
    throw new Error("Invalid PDF file.");
  }

  await mkdir(RESUME_PUBLIC_DIR, { recursive: true });
  const fileName = sanitizeResumePdfFilename(originalName);
  const absolutePath = path.join(RESUME_PUBLIC_DIR, fileName);
  await writeFile(absolutePath, buffer);

  return {
    fileName,
    filePath: getResumePdfPublicPath(fileName),
  };
}
