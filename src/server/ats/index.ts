import type { SourceKind } from '@prisma/client';
import { fetchGreenhouseJobs } from './greenhouse';
import { fetchLeverJobs } from './lever';
import { fetchAshbyJobs } from './ashby';
export async function fetchJobs(source: SourceKind, slug: string) {
  if (source === 'GREENHOUSE') return fetchGreenhouseJobs(slug);
  if (source === 'LEVER') return fetchLeverJobs(slug);
  if (source === 'ASHBY') return fetchAshbyJobs(slug);
  throw new Error(`Unsupported automated source: ${source}`);
}
