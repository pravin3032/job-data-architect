import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  CANDIDATE_PROFILE_PATH: z.string().default('config/candidate.local.json'),
  APPLICATION_ANSWERS_PATH: z.string().default('config/answers.local.json'),
  REVIEW_BEFORE_SUBMIT: z.coerce.boolean().default(true),
  ALLOW_AUTOSUBMIT: z.coerce.boolean().default(false),
  FOLLOWUP_DAYS: z.coerce.number().int().min(1).max(30).default(7)
});

export type AppConfig = z.infer<typeof envSchema>;
export function getConfig(): AppConfig { return envSchema.parse(process.env); }
