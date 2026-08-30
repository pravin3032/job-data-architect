import { z } from 'zod';
import { stripHtml } from '@/lib/text';
import { atsFetch } from './http';
import type { NormalizedJob } from './types';

const responseSchema = z.object({ jobs: z.array(z.object({
  id: z.number(), title: z.string(), absolute_url: z.string().url(), updated_at: z.string().optional(),
  location: z.object({ name: z.string() }), content: z.string().default(''), departments: z.array(z.object({name:z.string()})).optional()
})) });
export async function fetchGreenhouseJobs(companySlug: string): Promise<NormalizedJob[]> {
  const response = await atsFetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(companySlug)}/jobs?content=true`);
  const data = responseSchema.parse(await response.json());
  return data.jobs.map(job => ({ source:'GREENHOUSE', externalId:String(job.id), title:job.title, company:companySlug,
    location:job.location.name, workplaceType:/remote/i.test(job.location.name)?'REMOTE':undefined, url:job.absolute_url,
    description:stripHtml(job.content), postedAt:job.updated_at?new Date(job.updated_at):undefined }));
}
