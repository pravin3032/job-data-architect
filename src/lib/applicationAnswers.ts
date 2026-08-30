import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

const answersSchema = z.object({
  workAuthorization: z.string(), requiresSponsorship: z.boolean(), willingToRelocate: z.boolean(),
  willingToTravelPercent: z.number().min(0).max(100), desiredSalary: z.number().int().positive().optional(),
  earliestStartDate: z.string().nullable().optional(), eeoDefault: z.enum(['PREFER_NOT_TO_ANSWER','DECLINE','USER_REQUIRED'])
});
export type ApplicationAnswers = z.infer<typeof answersSchema>;

export async function loadApplicationAnswers(path = process.env.APPLICATION_ANSWERS_PATH ?? 'config/answers.local.json') {
  try { return answersSchema.parse(JSON.parse(await readFile(resolve(/* turbopackIgnore: true */ process.cwd(), path), 'utf8'))); }
  catch { return answersSchema.parse(JSON.parse(await readFile(resolve(process.cwd(), 'config/answers.example.json'), 'utf8'))); }
}

export function detectHumanBlockers(pageText: string) {
  const t = pageText.toLowerCase();
  const blockers: string[] = [];
  if (/captcha|i'?m not a robot|human check/.test(t)) blockers.push('CAPTCHA');
  if (/verification code|multi-factor|two-factor|mfa/.test(t)) blockers.push('MFA');
  if (/certify|attest|under penalty|electronic signature/.test(t)) blockers.push('LEGAL_ATTESTATION');
  return blockers;
}
