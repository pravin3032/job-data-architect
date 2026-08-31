import { z } from 'zod';
import { stripHtml } from '@/lib/text';
import { atsFetch } from './http';
import type { NormalizedJob } from './types';
const postingSchema = z.array(z.object({ id:z.string(), text:z.string(), hostedUrl:z.string().url(), createdAt:z.number().optional(),
  descriptionPlain:z.string().optional(), description:z.string().optional(), categories:z.object({location:z.string().optional(),commitment:z.string().optional(),team:z.string().optional()}).passthrough() }));
export async function fetchLeverJobs(companySlug: string): Promise<NormalizedJob[]> {
  const response = await atsFetch(`https://api.lever.co/v0/postings/${encodeURIComponent(companySlug)}?mode=json`);
  return postingSchema.parse(await response.json()).map(job => ({ source:'LEVER', externalId:job.id, title:job.text, company:companySlug,
    location:job.categories.location, workplaceType:/remote/i.test(job.categories.location??'')?'REMOTE':undefined,
    employmentType:job.categories.commitment, url:job.hostedUrl, description:stripHtml(job.descriptionPlain??job.description??''),
    postedAt:job.createdAt?new Date(job.createdAt):undefined }));
}
