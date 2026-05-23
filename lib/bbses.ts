import { promises as fs } from "fs";
import path from "path";
import { parse } from "yaml";
import { z } from "zod";

const TerminalMode = z.enum([
  "ANSI-40",
  "ANSI-wide",
  "VT102",
  "VT102-wide",
  "Standard-40",
  "Standard-80",
  "Std-80-wide",
  "Commodore",
  "VT52",
]);

const Baud = z.union([z.literal(2400), z.literal(9600), z.literal(38400)]);

const AnsiStyle = z.enum(["petscii", "ascii", "ansi", "mixed"]);

const BbsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be url-safe (a-z, 0-9, -)"),
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  sysop: z.string().optional(),
  established: z.number().int().min(1980).max(2100).optional(),
  description: z.string(),
  terminal_modes: z.array(TerminalMode).min(1),
  baud_recommended: Baud,
  tags: z.array(z.string()),
  ansi_style: AnsiStyle,
  country: z.string().length(2),
  homepage: z.string().url().optional(),
  submitted_by: z.string().optional(),
});

export type Bbs = z.infer<typeof BbsSchema>;

const FileSchema = z.object({
  bbses: z.array(BbsSchema),
});

let cached: Bbs[] | null = null;

export async function getAllBbses(): Promise<Bbs[]> {
  if (cached) return cached;
  const file = path.join(process.cwd(), "data", "bbses.yaml");
  const raw = await fs.readFile(file, "utf8");
  const parsed = FileSchema.parse(parse(raw));
  cached = parsed.bbses;
  return parsed.bbses;
}

export async function getBbsBySlug(slug: string): Promise<Bbs | undefined> {
  const all = await getAllBbses();
  return all.find((b) => b.slug === slug);
}

export function bvtermDialString(bbs: Bbs): string {
  // Matches Striketerm 2014 / BVTerm 2026's Hayes ATDT convention.
  return `ATDT ${bbs.host}:${bbs.port}`;
}

export function recommendedTerminalMode(bbs: Bbs): string {
  // Prefer ANSI-wide (the 80-col mode BVTerm 2026 targets) when supported,
  // then ANSI-40, then whatever's first.
  if (bbs.terminal_modes.includes("ANSI-wide")) return "ANSI-wide";
  if (bbs.terminal_modes.includes("ANSI-40")) return "ANSI-40";
  return bbs.terminal_modes[0];
}

/** All unique tags across the dataset, sorted alphabetically. */
export async function getAllTags(): Promise<string[]> {
  const all = await getAllBbses();
  const tags = new Set<string>();
  for (const b of all) for (const t of b.tags) tags.add(t);
  return [...tags].sort();
}
