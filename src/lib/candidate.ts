import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

export const claimSchema = z.object({ id: z.string(), text: z.string().min(1), tags: z.array(z.string()) });
export const candidateSchema = z.object({
  headline: z.string(),
  yearsExperience: z.number().int().positive(),
  targetTitles: z.array(z.string()).min(1),
  targetLocations: z.array(z.string()).min(1),
  minimumBaseSalary: z.number().int().nonnegative().optional(),
  skills: z.array(z.string()).min(1),
  certifications: z.array(z.string()).default([]),
  claims: z.array(claimSchema).min(1)
});
export type CandidateProfile = z.infer<typeof candidateSchema>;

export async function loadCandidateProfile(path = process.env.CANDIDATE_PROFILE_PATH ?? 'config/candidate.local.json') {
  const fallback = 'config/candidate.example.json';
  let raw: string;
  try { raw = await readFile(resolve(process.cwd(), path), 'utf8'); }
  catch { raw = await readFile(resolve(process.cwd(), fallback), 'utf8'); }
  return candidateSchema.parse(JSON.parse(raw));
}
