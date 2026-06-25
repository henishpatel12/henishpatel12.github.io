import { defineCollection, z } from "astro:content";
import { sheetLoader } from "astro-sheet-loader";

function extractDocumentId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? trimmed;
}

const sheetValue =
  import.meta.env.PUBLIC_GOOGLE_SHEETS_DOCUMENT_ID ??
  import.meta.env.PUBLIC_GOOGLE_SHEETS_CSV_URL ??
  "";

const documentId = extractDocumentId(sheetValue);

const phones = defineCollection({
  loader: sheetLoader({
    document: documentId || "missing-document-id",
    gid: 0,
    query: "select A,B,C,D,E where A != 'model' label A 'model', B 'color', C 'storage', D 'condition', E 'image'",
  }),
  schema: z.object({
    model: z.string().default(""),
    color: z.string().default(""),
    storage: z.string().default(""),
    condition: z.string().default(""),
    image: z.string().default(""),
  }),
});

export const collections = { phones };
